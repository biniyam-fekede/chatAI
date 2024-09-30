# Llama-3.1-8B AI Doctor's Assistant - Fine-Tuning 

This repository contains the code and instructions for fine-tuning the **Llama-3.1-8B AI Doctor's Assistant** model using the **AI Doctor Assistant Dataset**. The fine-tuned model specializes in medical question-answering tasks, offering insights on various medical conditions, symptoms, treatments, and more.

## Overview

The **Llama-3.1-8B AI Doctor's Assistant** model is designed to assist in medical-related conversations, answering questions and providing information based on a large corpus of medical data. The fine-tuning process uses **Low-Rank Adaptation (LoRA)** and **4-bit quantization** to efficiently fine-tune a large model on consumer-grade hardware, significantly reducing the computational resources required while maintaining high performance.

- **Base Model**: [Llama-3.1-8B-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct)
- **Fine-tuned Model**: [Llama-3.1-8B AI Doctor's Assistant](https://huggingface.co/Samuelawud/Llama-3-1-8B-AI-Doctors-Assistant)
- **Dataset**: [AI Doctor Assistant Dataset](https://huggingface.co/datasets/Samuelawud/AI-doctor-assistant-dataset)
- **Techniques**: LoRA, 4-bit quantization with `BitsAndBytes`.

## Fine-Tuning Process Overview

The fine-tuning process involves:

- **Loading the base Llama-3.1-8B model** from Hugging Face.
- **Loading and tokenizing the AI Doctor Assistant dataset**.
- **Applying quantization** using BitsAndBytes for efficient memory usage.
- **Using LoRA (Low-Rank Adaptation)** for parameter-efficient fine-tuning.
- **Training the model** on the medical question-answer dataset.
- **Saving and pushing the fine-tuned model** to Hugging Face.

# How to Use the Fine-Tuned Llama-3.1-8B AI Doctor's Assistant Model

The **Llama-3.1-8B AI Doctor's Assistant** model has been fine-tuned for medical question-answering tasks. You can easily integrate this model into your project using the Hugging Face `transformers` library.

👉 **[View and access the model on Hugging Face](https://huggingface.co/Samuelawud/Llama-3-1-8B-AI-Doctors-Assistant)**

## Prerequisites

Before proceeding, ensure that you have installed the required dependencies. Run the following command to install the necessary libraries:

!pip install -q -U transformers datasets accelerate peft trl bitsandbytes wandb

## 1. Loading the Model and Tokenizer

You can load the fine-tuned model and tokenizer directly from Hugging Face with the following code:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load the fine-tuned model and tokenizer
model = AutoModelForCausalLM.from_pretrained("Samuelawud/Llama-3-1-8B-AI-Doctors-Assistant")
tokenizer = AutoTokenizer.from_pretrained("Samuelawud/Llama-3-1-8B-AI-Doctors-Assistant")

# Example prompt
prompt = "What are the symptoms of COVID-19?"

# Tokenize the input
inputs = tokenizer(prompt, return_tensors="pt")

# Generate a response using the model
outputs = model.generate(inputs['input_ids'], max_length=128)
response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(response)



