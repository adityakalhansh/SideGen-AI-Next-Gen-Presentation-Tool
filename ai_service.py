import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client
api_key = os.environ.get("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key and api_key != "your_groq_api_key_here" else None

MODEL = "llama-3.3-70b-versatile"

def get_suggestions(topic):
    if not client:
        # Dummy suggestions if no API key is provided
        return [
            f"The Ultimate Guide to {topic}",
            f"Understanding {topic}: A Comprehensive Overview",
            f"10 Things You Need to Know About {topic}"
        ]
    
    prompt = f"Generate 3 catchy, professional presentation titles for the topic '{topic}'. Return ONLY a valid JSON array of strings. Do not include any other text."
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful presentation assistant. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            model=MODEL,
            response_format={"type": "json_object"} # Groq supports this for llama3, but sometimes it requires the prompt to include the word 'JSON'
        )
        # Note: 'response_format={"type": "json_object"}' returns a JSON object. We should ask for an object containing a list.
    except Exception as e:
        print(f"Error calling Groq: {e}")
        return [f"{topic} Overview", f"Introduction to {topic}", f"{topic} Deep Dive"]

def get_outline(topic, level, length):
    length_map = {"short": 5, "medium": 8, "long": 12}
    slide_count = length_map.get(length.lower(), 5)
    
    level_instruction = ""
    if level.lower() == "basic":
        level_instruction = "Use simple, easy-to-understand language suitable for middle school students."
    elif level.lower() == "advanced":
        level_instruction = "Use formal, academic, and deep technical language suitable for college students or professionals."
    else:
        level_instruction = "Use standard, clear, and professional language."

    prompt = f"""You are an expert presentation creator.
Create an outline for a PowerPoint presentation with EXACTLY {slide_count} slides about '{topic}'.
{level_instruction}

Requirements:
- Slide 1 MUST be a Title Slide.
- Slide 2 MUST be an Introduction.
- The last slide MUST be a Conclusion.
- Provide 3 to 5 clear bullet points for each slide.
- Provide a short visual image prompt for EACH slide that describes what image would match the slide.

Return ONLY a JSON object with a single key "slides", which is an array of objects.
Each object must have:
- "title" (string)
- "bullets" (array of strings)
- "image_prompt" (string)
"""

    if not client:
        # Fallback dummy data
        return {"slides": [
            {"title": f"Title Slide: {topic}", "bullets": [f"Welcome to {topic}", "Presented by AI"], "image_prompt": f"abstract technology {topic}"},
            {"title": f"Introduction to {topic}", "bullets": ["What is it?", "Why does it matter?"], "image_prompt": f"introductory concept {topic}"},
            {"title": f"Conclusion", "bullets": ["Summary", "Thank you"], "image_prompt": "thank you end"}
        ]}

    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert presentation creator. Always respond with ONLY valid JSON."},
                {"role": "user", "content": prompt}
            ],
            model=MODEL,
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"Error calling Groq: {e}")
        return {"slides": []}

# Update get_suggestions to use json_object properly
def get_suggestions(topic):
    if not client:
        return [
            f"The Ultimate Guide to {topic}",
            f"Understanding {topic}: A Comprehensive Overview",
            f"10 Things You Need to Know About {topic}"
        ]
    
    prompt = f"Generate 3 catchy, professional presentation titles for the topic '{topic}'. Return ONLY a JSON object with a key 'titles' mapping to an array of 3 strings."
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful presentation assistant. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            model=MODEL,
            response_format={"type": "json_object"}
        )
        content = json.loads(response.choices[0].message.content)
        return content.get("titles", [])
    except Exception as e:
        print(f"Error calling Groq: {e}")
        return [f"{topic} Overview", f"Introduction to {topic}", f"{topic} Deep Dive"]
