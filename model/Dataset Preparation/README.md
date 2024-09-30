# AI Doctor Assistant Dataset - Preparation Code

This repository contains the **dataset preparation code** for the AI Doctor Assistant project. The dataset preparation process includes tokenization, filtering, deduplication, and more. The full dataset has been uploaded to Hugging Face and can be accessed through the link provided below.

## Dataset Preparation

This code prepares the dataset for fine-tuning a language model to perform medical question answering tasks. It uses the following steps:

1. **Tokenization**: Tokenizes both the medical questions and answers using the Llama model tokenizer.
2. **Filtering**: Filters out rows that exceed a certain token length (4096 tokens).
3. **Deduplication**: Removes near-duplicate rows based on cosine similarity using FAISS and SentenceTransformers.
4. **Top-K Sampling**: Extracts the top rows with the most tokens for a more challenging fine-tuning task.
5. **Chat Template Mapping**: Re-formats the dataset into an instruction-response format to match the fine-tuning style.

## Accessing the Dataset

The full dataset is hosted on Hugging Face Datasets. You can load it directly into your Python environment using the Hugging Face `datasets` library.

👉 **[Click here to access the full dataset on Hugging Face](https://huggingface.co/datasets/Samuelawud/AI-doctor-assistant-dataset)**

### How to Load the Dataset

You can use the following code to load the dataset into your project:

```python
from datasets import load_dataset

# Load the dataset from Hugging Face
dataset = load_dataset("Samuelawud/AI-doctor-assistant-dataset")

# Display the first few rows of the training data
print(dataset['train'].to_pandas().head())
