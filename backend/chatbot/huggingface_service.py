import requests
import re
import logging
import os
from dotenv import load_dotenv
load_dotenv()

logger = logging.getLogger(__name__)

# Hugging Face API token
HUGGING_FACE_API_TOKEN = os.getenv('HUGGING_FACE_TOKEN')
if HUGGING_FACE_API_TOKEN is None:
    raise ValueError("Hugging Face API token not found in environment variables")

# Model ID 
# Make sure the model is hosted for the app to work as expected
MODEL_ID = "Samuelawud/Llama-3-1-8B-AI-Doctors-Assistant"

# Hugging Face Inference API URL
API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"

# Headers for the request
headers = {
    "Authorization": f"Bearer {HUGGING_FACE_API_TOKEN}",
    "Content-Type": "application/json"
}

# Initialize conversation history
conversation_history = []

# Function to clean the response to keep only the assistant's answer
def extract_assistant_response(response_text):
    # Use regex to extract text after the assistant header
    match = re.search(r'<\|start_header_id\|>assistant<\|end_header_id\|>(.*?)$', response_text, re.DOTALL)
    if match:
        assistant_reply = match.group(1)
        # Remove any trailing special tokens
        assistant_reply = re.sub(r'<\|.*?\|>', '', assistant_reply).strip()
        # Truncate the response to 1500 words if necessary
        words = assistant_reply.split()
        if len(words) > 1500:
            assistant_reply = ' '.join(words[:1500])
        return assistant_reply
    else:
        # Return an error message if extraction fails
        return "Error: Could not extract the assistant's response."

# Function to query Hugging Face API
def query_huggingface(user_input, system_context, temperature=0.7, top_p=0.9):
    # Add the new user input to the conversation history
    conversation_history.append({
        "role": "user",
        "content": user_input
    })

    # Limit conversation history to last N user messages
    N = 3  # Adjust as needed
    truncated_history = conversation_history[-N:]

    # Construct the conversation history in the prompt
    conversation = ""
    for turn in truncated_history:
        conversation += f"<|start_header_id|>user<|end_header_id|>\n{turn['content']}<|eot_id|>\n\n"

    # Build the full prompt
    prompt_template = f"""
<|start_header_id|>system<|end_header_id|>
{system_context}<|eot_id|>

{conversation}
<|start_header_id|>assistant<|end_header_id|>
"""

    data = {
        "inputs": prompt_template.strip(),
        "parameters": {
            "temperature": temperature,
            "top_p": top_p,
            "max_new_tokens": 1500,  # Adjust if necessary
            "stop": ["<|endoftext|>", "<|eot_id|>", "<|start_header_id|>"]
        }
    }

    try:
        # Send request to Hugging Face API
        response = requests.post(API_URL, headers=headers, json=data)

        if response.status_code == 200:
            result = response.json()
            # Extract the generated text from the response
            if isinstance(result, list) and len(result) > 0:
                raw_response = result[0].get("generated_text", "")
            else:
                raw_response = result.get("generated_text", "")

            # Extract the assistant's reply
            assistant_reply = extract_assistant_response(raw_response)

            # Add the assistant's reply to the conversation history (optional)
            # This is for logging purposes and isn't included in the prompt
            conversation_history.append({
                "role": "assistant",
                "content": assistant_reply
            })

            return assistant_reply
        else:
            logger.error(f"Hugging Face API error: {response.status_code}, {response.text}")
            return f"Error: Unable to get a valid response (status code: {response.status_code})"

    except requests.exceptions.RequestException as e:
        logger.error(f"Request to Hugging Face API failed: {str(e)}")
        return "Error: Failed to connect to the Hugging Face API."
