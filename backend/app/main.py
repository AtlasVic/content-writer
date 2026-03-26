from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import anthropic
import openai
import httpx

app = FastAPI(title="Content Writer API")

# CORS - allow all for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    content_type: str
    model: str
    inputs: dict
    api_key: Optional[str] = None

class GenerateResponse(BaseModel):
    content: str
    model: str

# Content type prompts
PROMPTS = {
    "blog": "Write a blog post about {topic} for {audience}. Tone: {tone}. Word count: approximately {word_count} words. Include an engaging introduction, use headers for main points, and add a conclusion with a call-to-action.",
    "social": "Write {count} social media posts about {topic} for {platform}. Tone: {tone}. Make each post unique, include relevant hashtags, and add a call-to-action or engagement hook.",
    "product": "Write a compelling product description for {product_name}. Features: {features}. Target audience: {audience}. Tone: {tone}. Highlight key features and benefits, make it conversion-focused, and include a compelling headline.",
    "email": "Write a {email_type} email. Context: {context}. Tone: {tone}. Make it professional and ready to send, include an appropriate subject line suggestion.",
    "ad": "Write ad copy for {product}. Platform: {platform}. Goal: {goal}. Character limit: {character_limit} characters. Make it punchy, action-oriented, and focus on results."
}

def build_prompt(content_type: str, inputs: dict) -> str:
    template = PROMPTS.get(content_type, "")
    # Replace placeholders with input values
    for key, value in inputs.items():
        template = template.replace(f"{{{key}}}", str(value))
    return template

def get_openai_key() -> str:
    return os.getenv("OPENAI_API_KEY", "")

def get_anthropic_key() -> str:
    return os.getenv("ANTHROPIC_API_KEY", "")

@app.post("/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    prompt = build_prompt(req.content_type, req.inputs)
    api_key = req.api_key
    
    # Determine provider
    if req.model.startswith("gpt-"):
        # OpenAI
        if not api_key:
            api_key = get_openai_key()
        if not api_key:
            raise HTTPException(status_code=400, detail="OpenAI API key required")
        
        client = openai.OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model=req.model,
            messages=[{"role": "user", "content": prompt}]
        )
        content = response.choices[0].message.content
        
    elif req.model.startswith("claude-"):
        # Anthropic
        if not api_key:
            api_key = get_anthropic_key()
        if not api_key:
            raise HTTPException(status_code=400, detail="Anthropic API key required")
        
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model=req.model,
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        content = response.content[0].text
        
    elif req.model == "minimax":
        # MiniMax
        if not api_key:
            raise HTTPException(status_code=400, detail="MiniMax API key required (format: group_id:api_key)")
        
        parts = api_key.split(":")
        if len(parts) != 2:
            raise HTTPException(status_code=400, detail="MiniMax key must be format: group_id:api_key")
        
        group_id, mini_key = parts
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.minimax.chat/v1/text/chatcompletion_v2",
                headers={"Authorization": f"Bearer {mini_key}", "Content-Type": "application/json"},
                json={"model": "abab6.5s-chat", "messages": [{"role": "user", "content": prompt}]}
            )
            if resp.status_code != 200:
                raise HTTPException(status_code=400, detail=resp.text)
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            
    elif req.model == "ollama":
        # Ollama (local)
        async with httpx.AsyncClient(timeout=60.0) as client:
            model_name = req.inputs.get("ollama_model", "llama3")
            resp = await client.post(
                "http://localhost:11434/api/generate",
                json={"model": model_name, "prompt": prompt, "stream": False}
            )
            if resp.status_code != 200:
                raise HTTPException(status_code=400, detail=resp.text)
            data = resp.json()
            content = data.get("response", "")
            
    else:
        raise HTTPException(status_code=400, detail=f"Unknown model: {req.model}")
    
    return GenerateResponse(content=content, model=req.model)

@app.get("/health")
def health():
    return {"status": "ok"}