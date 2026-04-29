import os
from flask import Flask, render_template, request, jsonify, send_file
from ai_service import get_suggestions, get_outline
from ppt_creator import create_presentation

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/suggest-titles", methods=["POST"])
def suggest_titles():
    data = request.json
    topic = data.get("topic", "")
    if not topic:
        return jsonify({"error": "Topic is required"}), 400
        
    titles = get_suggestions(topic)
    return jsonify({"titles": titles})

@app.route("/api/generate-outline", methods=["POST"])
def generate_outline():
    data = request.json
    topic = data.get("topic", "")
    level = data.get("level", "standard")
    length = data.get("length", "medium")
    
    if not topic:
        return jsonify({"error": "Topic is required"}), 400
        
    outline = get_outline(topic, level, length)
    return jsonify(outline)

@app.route("/api/generate-ppt", methods=["POST"])
def generate_ppt():
    data = request.json
    slides = data.get("slides", [])
    theme = data.get("theme", "minimal_white")
    topic = data.get("topic", "Presentation")
    
    if not slides:
        return jsonify({"error": "Slides data is required"}), 400
        
    # Clean up topic string for filename
    safe_topic = "".join([c if c.isalnum() else "_" for c in topic])
    filename = f"{safe_topic}.pptx"
    
    output_path = create_presentation(slides, theme, filename)
    
    return send_file(output_path, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
