import os
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()  # This uses your OPENAI_API_KEY from .env

# Initialize Pinecone with new SDK pattern
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Connect or create index
index_name = os.getenv("PINECONE_INDEX")

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=1024,  # Use 1536 for "text-embedding-3-large", 1024 for "small"
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region=os.getenv("PINECONE_ENV"))  # e.g., "us-west-2"
    )

index = pc.Index(index_name)

def embed_text(text: str):
    """Generate OpenAI embedding (1024 dims)"""
    response = client.embeddings.create(
        input=[text],
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

def save_note_to_pinecone(note_id, full_text, metadata):
    """Embed + save to Pinecone"""
    embedding = embed_text(full_text)
    index.upsert([{
        "id": note_id,
        "values": embedding,
        "metadata": metadata
    }])