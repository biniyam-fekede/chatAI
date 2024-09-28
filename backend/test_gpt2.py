from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

def test_gpt2():
    model_name = "gpt2"
    # Load the tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)

    # Create a pipeline for text generation
    text_generator = pipeline("text-generation", model=model, tokenizer=tokenizer)

    # Provide input
    input_text = "Once upon a time"
    
    # Generate text
    output = text_generator(input_text, max_length=50)
    
    # Print output
    print(output[0]['generated_text'])

if __name__ == "__main__":
    test_gpt2()
