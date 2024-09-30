# Llama-3-1-8B AI Doctor's Assistant - Partial Model Repository

This repository contains **partial model configuration files** and tokenizers for the Llama-3-1-8B AI Doctor's Assistant model. The complete model, including the large model weights, can be accessed via Hugging Face.

## Files Included in This Repository

The following files are included in this repository:

- `config.json`: Model configuration file.
- `generation_config.json`: Configuration for text generation.
- `model.safetensors`: SafeTensors format for the model (partial).
- `special_tokens_map.json`: Special tokens used by the model.
- `tokenizer.json`: Tokenizer file used to process input text for the model.
- `tokenizer_config.json`: Configuration for the tokenizer.

### Large Model Weights

The large model weights (e.g., `model-00001-of-00004`, `model-00002-of-00004`, etc.) **are not included** in this repository due to their size.

To access the complete model files, including the weights, visit the Hugging Face model page:

👉 **[Access the full model on Hugging Face](https://huggingface.co/Samuelawud/Llama-3-1-8B-AI-Doctors-Assistant/tree/main)**

You can download the full model weights (`model-00001-of-00004` to `model-00004-of-00004`) from there.

## How to Use the Model

You can load the model and tokenizer directly from Hugging Face by using the following code snippet:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load the tokenizer and model from Hugging Face
tokenizer = AutoTokenizer.from_pretrained("Samuelawud/Llama-3-1-8B-AI-Doctors-Assistant")
model = AutoModelForCausalLM.from_pretrained("Samuelawud/Llama-3-1-8B-AI-Doctors-Assistant")

# Example usage
inputs = tokenizer("Hello, how can you assist me today?", return_tensors="pt")
outputs = model.generate(inputs["input_ids"])

print(tokenizer.decode(outputs[0], skip_special_tokens=True))

