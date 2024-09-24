from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

# Model and tokenizer initialization
class ModelService:
    def __init__(self):
        # Use GPT-2 model
        model_name = "gpt2"

        # Load the tokenizer and model
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name)

        # Create a text generation pipeline
        self.pipeline = pipeline(task="text-generation", model=self.model, tokenizer=self.tokenizer, max_length=128)

    def predict(self, user_input):
        # Prepare the instruction for the model
        instruction = f"### Instruction:\n{user_input}\n\n### Response:\n"
        result = self.pipeline(instruction)
        return result[0]['generated_text'][len(instruction):]  # Extract the generated text after the instruction
