# AI Doctor's Assistant Model Fine-Tuning

## Overview

This repository contains the code and resources for fine-tuning Meta's Llama 3.1 8B parameter model on a large medical questions and answers dataset. This fine-tuned model serves as a core component of the AI Doctor's Assistant web application, enabling it to provide accurate and helpful responses to medical queries.

## Repository Structure

The project is organized into three main components:

1. Dataset Preparation
2. Model Fine-Tuning
3. Model Configuration

## 1. Dataset Preparation

### Description

This component includes the code for preparing the medical questions and answers dataset used for fine-tuning the Llama 3.1 8B model.

### Key Features

- Tokenization using the Llama model tokenizer
- Filtering of long sequences (>4096 tokens)
- Deduplication based on cosine similarity
- Top-K sampling for challenging fine-tuning tasks
- Chat template mapping for instruction-response format

### Accessing the Dataset

The full dataset is hosted on Hugging Face Datasets:

[AI Doctor Assistant Dataset on Hugging Face](https://huggingface.co/datasets/Samuelawud/AI-doctor-assistant-dataset)

To load the dataset:

```python
from datasets import load_dataset

dataset = load_dataset("Samuelawud/AI-doctor-assistant-dataset")
```

## 2. Model Fine-Tuning

### Description

This component contains the code and instructions for fine-tuning the Llama 3.1 8B model on the prepared medical dataset.

### Key Features

- Base Model: [Llama-3.1-8B-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct)
- Fine-tuned Model: [Llama-3.1-8B AI Doctor's Assistant](https://huggingface.co/Samuelawud/Llama-3-1-8B-AI-Doctors-Assistant)
- Techniques: Low-Rank Adaptation (LoRA), 4-bit quantization with BitsAndBytes

### Fine-Tuning Process

1. Load the base Llama 3.1 8B model
2. Load and tokenize the prepared medical dataset
3. Apply quantization using BitsAndBytes
4. Use LoRA for parameter-efficient fine-tuning
5. Train the model on the medical question-answer dataset
6. Save and push the fine-tuned model to Hugging Face

## 3. Model Configuration

### Description

This component includes the model configuration files and tokenizers for the fine-tuned Llama 3.1 8B AI Doctor's Assistant model.

### Included Files

- `config.json`: Model configuration
- `generation_config.json`: Text generation configuration
- `model.safetensors`: SafeTensors format for the model
- `special_tokens_map.json`: Special tokens used by the model
- `tokenizer.json`: Tokenizer file
- `tokenizer_config.json`: Tokenizer configuration

### Accessing the Full Model

The complete fine-tuned model is available on Hugging Face:

[Llama-3.1-8B AI Doctor's Assistant on Hugging Face](https://huggingface.co/Samuelawud/Llama-3-1-8B-AI-Doctors-Assistant/tree/main)

## Usage

To use the fine-tuned AI Doctor's Assistant model in your project:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load the model and tokenizer
model = AutoModelForCausalLM.from_pretrained("Samuelawud/Llama-3-1-8B-AI-Doctors-Assistant")
tokenizer = AutoTokenizer.from_pretrained("Samuelawud/Llama-3-1-8B-AI-Doctors-Assistant")

# Example usage
prompt = "What are the symptoms of COVID-19?"
inputs = tokenizer(prompt, return_tensors="pt")
outputs = model.generate(inputs['input_ids'], max_length=128)
response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(response)
```

## Installation

To set up the environment for fine-tuning:

```bash
pip install -q -U transformers datasets accelerate peft trl bitsandbytes wandb
```

## Contributing

Contributions to improve the dataset preparation, fine-tuning process, or model performance are welcome. Please submit pull requests or open issues to discuss potential changes.

## License

[Include appropriate license information here]

## Acknowledgments

- Meta AI for the Llama model series
- Hugging Face for hosting datasets and models
- Contributors to the medical questions and answers dataset

For more information or support, please open an issue in this repository.
