import requests
import re
import logging

logger = logging.getLogger(__name__)

# Hugging Face API token
HUGGING_FACE_API_TOKEN = ""

# Model ID (use your correct model)
MODEL_ID = "meta-llama/Meta-Llama-3.1-70B-Instruct"

# Hugging Face Inference API URL
API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"

# Headers for the request
headers = {
    "Authorization": f"Bearer {HUGGING_FACE_API_TOKEN}",
    "Content-Type": "application/json"
}

# Function to clean the response to keep only the assistant's answer
def extract_assistant_response(response_text):
    clean_text = re.sub(r'<\|start_header_id\|>.*?<\|end_header_id\|>.*?<\|eot_id\|>', '', response_text, flags=re.DOTALL)
    clean_text = re.sub(r'<\|start_header_id\|>assistant<\|end_header_id\|>', '', clean_text)
    return clean_text.strip()

# Function to query Hugging Face API
def query_huggingface(user_input, system_context, temperature=0.7, top_p=0.9):
    prompt_template = f"""
    <|start_header_id|>system<|end_header_id|>
    {system_context}<|eot_id|>

    <|start_header_id|>user<|end_header_id|>
    {user_input}<|eot_id|>

    <|start_header_id|>assistant<|end_header_id|>
    """

    data = {
        "inputs": prompt_template,
        "parameters": {
            "temperature": temperature,
            "top_p": top_p
        }
    }

    try:
        # Send request to Hugging Face API
        response = requests.post(API_URL, headers=headers, json=data)

        if response.status_code == 200:
            result = response.json()
            raw_response = result[0].get("generated_text", "Sorry, I didn't understand.")
            return extract_assistant_response(raw_response)
        else:
            logger.error(f"Hugging Face API error: {response.status_code}, {response.text}")
            return f"Error: Unable to get a valid response (status code: {response.status_code})"

    except requests.exceptions.RequestException as e:
        logger.error(f"Request to Hugging Face API failed: {str(e)}")
        return "Error: Failed to connect to the Hugging Face API."
