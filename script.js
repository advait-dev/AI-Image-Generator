const promptForm = document.querySelector(".prompt-form");
const themeToggle = document.querySelector(".theme-toggle");
const promptBtn = document.querySelector(".prompt-btn");
const promptInput = document.querySelector(".prompt-input");
const generateBtn = document.querySelector(".generate-btn");
const galleryGrid = document.querySelector(".gallery-grid");
const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const API_KEY = "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"; // Hugging Face API Key
// Example prompts
const examplePrompts = [
  "In the center of a lush meadow, a captivating woman gazes into a reflective basin. Her delicate features are framed by flowing golden curls, her eyes filled with a mix of curiosity and melancholy. The scene is captured in a striking painting, with rich, vibrant colors that bring the meadow to life. The woman's performance is mesmerizing, exuding an air of elegance and mystery that draws the viewer in. This enchanting image evokes a sense of timeless beauty and introspection.",
  "A striking image of a young russian model dressed in a sleek black outfit, elegantly posing in front of a grand historic building during the golden hour. The warm sunlight highlights the textures of her outfit and the architectural details of the building behind her, creating a beautiful contrast against the deep blue sky. The composition captures her confident stance and poise, blending modern fashion with timeless architecture.",
  "A woman in her thirties, with striking features: blonde hair, piercing green eyes, a prominent forehead, a large straight nose, and defined cheekbones. Her bob hairstyle is elegantly styled with bangs, complementing the evening makeup she wears. She dons a luxurious floor-length dress, crafted from dark green velour. This image, whether a painting or photograph, captures the woman's beauty in exquisite detail, showcasing high quality and attention to intricacies.",
  "A powerful superhero in a green and red Spider-Man-inspired suit crashes through a brick building wall, causing debris and bricks to fly in every direction. The character’s body is in mid-air, legs extended, with cracks and destruction spreading from the point of impact. The environment shows a realistic cityscape with detailed brick textures, dust, and sunlight streaming through the background. The superhero’s suit is tight, highlighting their athletic physique, with glowing accents on the suit adding a sci-fi touch. The scene captures intense action and dynamic motion, with pieces of the wall frozen mid-fall, emphasizing the force of the collision.",
  "at a digital - physical world a feminine blond model with perfect modeling eyes, wears second skin dress made out from large hydrangea flowers, nature endless transparent mountains background",
  "generate a highly detailed and realistic image of a joyful woman wearing a vibrant, intricately designed orange and pink saree with golden embroidery, her long dark hair flowing freely as she twirls and laughs, surrounded by a flurry of colorful powders and liquids, her face and hands smeared with bright hues, particularly pink, yellow, green, and blue, during a lively Holi celebration, with a blurred background of people and festive decorations, capturing the essence of the joyous Indian festival, with a shallow depth of field, warm lighting, and a slight motion blur to convey the dynamic energy of the scene.",
  "Two elegant women in a sleek fashion studio, bathed in soft cinematic lighting that enhances the richness of their outfits. The black-haired girl, with long, flowing hair, wears a glossy burgundy patent coat cinched at the waist, accessorized with leopard-print gloves and oversized gold hoop earrings. The brown-haired girl, with soft Hollywood waves, dons a perfectly tailored burgundy blazer and a statement leopard-print mini skirt, exuding contemporary sophistication. The scene is meticulously composed, with a neutral-toned backdrop and dramatic shadows adding depth and elegance. This high-fashion portrait exudes power and grace. Photographed by Annie Leibovitz, shot with a Nikon Z7 and 85mm f/1.4 lens, soft studio, studio lighting, high-fashion editorial style, 8K",
  "Create a photo-realistic photography of an authentic and diverse Gucci young female russian model, styled in Gucci’s Spring collection, surrounded by oversized floral arrangements or surrealistic elements like flowers floating around them or growing from the ground beneath their feet. Natural light is used to evoke the feeling of fresh spring mornings, contrasted with stylized lighting for a modern, high-fashion feel. Maximalist and Surreal: Create a visually chaotic yet harmonized atmosphere with exaggerated proportions. Think of a model with oversized floral prints on a jacket, set in a vintage-style room with bizarre proportions and dream-like lighting. Use Alpha 7 IV - Full-frame Interchangeable Lens Camera. set and decorations Gucci style. photographed by Nan Goldin",
  "hyper realistic images of A young and beautiful female sailor from Russia walks steadily on the deck of a Russian warship, which is flying the Russian flag. She is tall and fit, wearing a white Russian navy uniform and a navy cap. Noon.",
  "a woman, serious face, look up something, on the street of New York city at foggy dark midnight in stormy hard rain",
  "Photorealistic, a smiling woman in a pastel-colored dress standing in a sunny park, holding a single flower, soft golden hour light creating a warm glow, minimalistic and peaceful composition, capturing the essence of International Women's Day",
  "A 20-year-old model with a confident yet serene expression stands in a minimalist, urban setting at golden hour. Her sleek, modern outfit — a tailored jacket over a simple white top and high-waisted pants — contrasts with the soft glow of the setting sun behind her. Her long hair cascades effortlessly over her shoulders, and her posture exudes both elegance and ease. The backdrop features a blurred cityscape, with light reflecting off sleek buildings, and the overall vibe is chic, sophisticated, and effortlessly stylish",
  "X-Men, X-Men style, Female, mutant, sun powers, light powers, glowing with golden light, light powers, the sun, sun powers, realistic, dynamic pose, full body portrait. --ar 9:16 --v 6.1",
  "A red Porsche concept car, futuristic, concrete environment, dark gray with warm colors, patio, glass, 8K HD --ar 9:16 --v 6.1",
  "built a picture including a new audi s6 Avant in White. in the background, there should be some snow and mountanins. on top of the car, there should be three same bikes. mae the rimps of the car black in the background it should be christmas with many christmas trees and light --ar 9:16 --stylize 450 --v 6.1",
];
// Set theme based on saved preference or system default
(() => {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDarkTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
  document.body.classList.toggle("dark-theme", isDarkTheme);
  themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
})();
// Switch between light and dark themes
const toggleTheme = () => {
  const isDarkTheme = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
  themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
};
// Calculate width/height based on chosen ratio
const getImageDimensions = (aspectRatio, baseSize = 512) => {
  const [width, height] = aspectRatio.split("/").map(Number);
  const scaleFactor = baseSize / Math.sqrt(width * height);
  let calculatedWidth = Math.round(width * scaleFactor);
  let calculatedHeight = Math.round(height * scaleFactor);
  // Ensure dimensions are multiples of 16 (AI model requirements)
  calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
  calculatedHeight = Math.floor(calculatedHeight / 16) * 16;
  return { width: calculatedWidth, height: calculatedHeight };
};
// Replace loading spinner with the actual image
const updateImageCard = (index, imageUrl) => {
  const imgCard = document.getElementById(`img-card-${index}`);
  if (!imgCard) return;
  imgCard.classList.remove("loading");
  imgCard.innerHTML = `<img class="result-img" src="${imageUrl}" />
                <div class="img-overlay">
                  <a href="${imageUrl}" class="img-download-btn" title="Download Image" download>
                    <i class="fa-solid fa-download"></i>
                  </a>
                </div>`;
};
// Send requests to Hugging Face API to create images
const generateImages = async (selectedModel, imageCount, aspectRatio, promptText) => {
  const MODEL_URL = `https://api-inference.huggingface.co/models/${selectedModel}`;
  const { width, height } = getImageDimensions(aspectRatio);
  generateBtn.setAttribute("disabled", "true");
  // Create an array of image generation promises
  const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
    try {
      // Send request to the AI model API
      const response = await fetch(MODEL_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "x-use-cache": "false",
        },
        body: JSON.stringify({
          inputs: promptText,
          parameters: { width, height },
        }),
      });
      if (!response.ok) throw new Error((await response.json())?.error);
      // Convert response to an image URL and update the image card
      const blob = await response.blob();
      updateImageCard(i, URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      const imgCard = document.getElementById(`img-card-${i}`);
      imgCard.classList.replace("loading", "error");
      imgCard.querySelector(".status-text").textContent = "Generation failed! Check console for more details.";
    }
  });
  await Promise.allSettled(imagePromises);
  generateBtn.removeAttribute("disabled");
};
// Create placeholder cards with loading spinners
const createImageCards = (selectedModel, imageCount, aspectRatio, promptText) => {
  galleryGrid.innerHTML = "";
  for (let i = 0; i < imageCount; i++) {
    galleryGrid.innerHTML += `
      <div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}">
        <div class="status-container">
          <div class="spinner"></div>
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p class="status-text">Generating...</p>
        </div>
      </div>`;
  }
  // Stagger animation
  document.querySelectorAll(".img-card").forEach((card, i) => {
    setTimeout(() => card.classList.add("animate-in"), 100 * i);
  });
  generateImages(selectedModel, imageCount, aspectRatio, promptText); // Generate Images
};
// Handle form submission
const handleFormSubmit = (e) => {
  e.preventDefault();
  // Get form values
  const selectedModel = modelSelect.value;
  const imageCount = parseInt(countSelect.value) || 1;
  const aspectRatio = ratioSelect.value || "1/1";
  const promptText = promptInput.value.trim();
  createImageCards(selectedModel, imageCount, aspectRatio, promptText);
};
// Fill prompt input with random example (typing effect)
promptBtn.addEventListener("click", () => {
  const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
  let i = 0;
  promptInput.focus();
  promptInput.value = "";
  // Disable the button during typing animation
  promptBtn.disabled = true;
  promptBtn.style.opacity = "0.5";
  // Typing effect
  const typeInterval = setInterval(() => {
    if (i < prompt.length) {
      promptInput.value += prompt.charAt(i);
      i++;
    } else {
      clearInterval(typeInterval);
      promptBtn.disabled = false;
      promptBtn.style.opacity = "0.8";
    }
  }, 10); // Speed of typing
});
themeToggle.addEventListener("click", toggleTheme);
promptForm.addEventListener("submit", handleFormSubmit);
