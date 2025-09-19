import { GoogleGenAI, Modality } from "@google/genai";
import { OutfitStyle, ShotType, GenerationModel } from '../types';

const GEMINI_API_KEY = process.env.API_KEY;
const SEEDREAM_API_KEY = process.env.SEEDREAM_API_KEY;

let geminiAi: GoogleGenAI | null = null;
let seedreamAi: GoogleGenAI | null = null;

const getAiClient = (model: GenerationModel): GoogleGenAI => {
    if (model === GenerationModel.GEMINI) {
        if (!GEMINI_API_KEY) {
            throw new Error("Missing Google Gemini API key. Please set the API_KEY environment variable.");
        }
        if (!geminiAi) {
            geminiAi = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        }
        return geminiAi;
    } else { // SEEDREAM
        if (!SEEDREAM_API_KEY) {
            throw new Error("Missing Seedream API key. Please set the SEEDREAM_API_KEY environment variable.");
        }
        if (!seedreamAi) {
            seedreamAi = new GoogleGenAI({ apiKey: SEEDREAM_API_KEY });
        }
        return seedreamAi;
    }
};

const base64ToPart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data.split(',')[1],
      mimeType,
    },
  };
};

const shotTypeDetails: Record<ShotType, string> = {
  'Closeup Shot': `
    - Framing: A classic portrait, framed from the waist up. This will capture the subject's upper body and expression.
    - Camera & Lens: Emulate a shot with a 35mm lens at f/2.5. This will capture some of the surrounding environment. Despite the wider lens, keep the composition focused on the subject to reduce the feeling of overall wideness.
    - Pose & Expression: The person should have a natural, engaging expression, suitable for a waist-up portrait.
  `,
  'Medium Close-up Shot': `
    - Framing: A classic medium portrait, framed from the waist up. This is perfect for capturing the subject's upper body, expression, and their interaction with the immediate environment.
    - Camera & Lens: Emulate a standard shot with a 50mm lens at f/2.2. This provides a natural field of view, similar to the human eye, capturing the subject and a portion of their surroundings without significant compression or distortion.
    - Pose & Expression: A natural pose where the person might be interacting with something or has their hands visible, suitable for this framing.
  `,
  'Knees-Up Medium Wide Shot': `
    - Framing: An "American Shot," framed from mid-thigh up. This shot should capture most of the person's body and their immediate surroundings to give a strong sense of place and context.
    - Camera & Lens: Emulate a 85mm lens at f/2.4. This will provide a natural field of view, capturing the subject within the scene without distortion and with a less wide, more focused perspective.
    - Pose & Expression: A confident, full-body pose that fits the environment. The person should appear naturally placed and central to the composition.
  `
};

const outfitStyleDetails: Record<OutfitStyle, string> = {
  [OutfitStyle.CASUAL]: `
    - Outfit Details: A stylish and modern casual outfit. Think high-quality fabrics and a cohesive look. Examples: well-fitting designer jeans with a fashionable top or knit sweater, a chic jumpsuit, or a stylish casual dress with fashionable sneakers or boots. The clothing should look natural and comfortable for the scene.
  `,
  [OutfitStyle.FORMAL]: `
    - Outfit Details: An elegant and sophisticated formal outfit. Examples: a modern, tailored suit (for any gender), a chic evening gown, or a stylish cocktail dress. The materials should look luxurious (e.g., silk, satin, fine wool) and the fit should be impeccable.
  `,
  [OutfitStyle.ARTISTIC]: `
    - Outfit Details: A creative and unique artistic outfit. This style is avant-garde and expressive. Think bold patterns, unconventional silhouettes, intricate textures, or designer pieces that make a statement. The outfit should be a work of art in itself, complementing the scene in a visually striking way.
  `,
  // NOTE: CUSTOM is handled dynamically in the prompt
  [OutfitStyle.CUSTOM]: '',
};

export const generatePhotoshootImage = async (
  portraitImage: string, // base64 string
  sceneImage: string, // base64 string
  outfitStyle: OutfitStyle,
  shotType: ShotType,
  generationModel: GenerationModel,
  customOutfitImage?: string | null
): Promise<string> => {
  try {
    const portraitMimeType = portraitImage.match(/data:(.*);base64,/)?.[1] ?? 'image/jpeg';
    const sceneMimeType = sceneImage.match(/data:(.*);base64,/)?.[1] ?? 'image/jpeg';
    
    const shotDetails = shotTypeDetails[shotType];
    const isCustomOutfit = outfitStyle === OutfitStyle.CUSTOM && customOutfitImage;

    const seedreamInstructions = `
**AI Engine:** Seedream (Simulated)
- **Aesthetic:** Emphasize a more dream-like, slightly stylized and artistic quality. Enhance colors and add a subtle, ethereal glow. Focus on creating a visually striking and imaginative composition rather than strict photorealism.
`;

    const geminiInstructions = `
**AI Engine:** Gemini
- **Hyper-Photorealism:** The final output must be indistinguishable from a high-resolution photograph taken with a professional DSLR/mirrorless camera and prime lens. Avoid any hint of being AI-generated.
`;

    const prompt = `
**Primary Goal:** Create a single, professional photograph by seamlessly compositing a person into a background scene with a new outfit, following the specified AI engine aesthetic.

**Input Image Confirmation:**
- Image 1 (First): The background SCENE.
- Image 2 (Second): The reference PERSON whose likeness must be preserved.
${isCustomOutfit ? '- Image 3 (Third): The reference OUTFIT to be applied to the person.' : ''}

${generationModel === GenerationModel.SEEDREAM ? seedreamInstructions : geminiInstructions}

**CRITICAL MANDATES - These rules are absolute and must not be violated under any circumstances:**

1.  **Perfect Facial Likeness (Highest Priority):**
    - The generated face MUST be an **exact, pixel-perfect replica** of the reference person (Image 2).
    - **ZERO DEVIATION:** Do not alter, stylize, beautify, or interpret the facial features in any way. This includes the precise shape of the eyes, nose, mouth, jawline, and unique skin details (moles, freckles).
    - Your primary function is to flawlessly composite the real face, not generate a new one. Any change to the person's identity is a complete failure of the task.

2.  **Anatomical and Proportional Integrity:**
    - **Anatomical Correctness:** The person's body must be complete and anatomically sound. All limbs, hands, and feet (if visible) must be fully rendered, with the correct number of fingers and toes, and positioned logically. There must be **no missing or malformed body parts.**
    - **Realistic Proportions:** The head-to-body ratio MUST be natural and anatomically correct. The size of the head must be proportional to the generated body. **Strictly forbid any 'bobblehead' effect or exaggerated features.** The final image must look like a photograph of a real human.

**Core Instructions - Follow these steps precisely, adhering to the Critical Mandates above:**

1.  **Analyze the Scene:**
    - Identify the lighting source, direction, color temperature (e.g., warm golden hour, cool overcast day), and quality (e.g., soft diffused, hard direct).
    - Note the overall mood, environment, and time of day.
    - Understand the perspective and depth of the scene.

2.  **Integrate the Person:**
    - Place the person from the reference image realistically into the scene. The person's scale and perspective must perfectly match the background.
    - Adhere strictly to the "Anatomical and Proportional Integrity" mandate at all times.
    ${
      isCustomOutfit
        ? `- Dress the person in the outfit from the reference OUTFIT image (Image 3). **IMPORTANT: If a person is visible in the outfit image, completely ignore them. Your only task is to extract the clothing and apply it to the reference PERSON (Image 2).** Adapt the fit, proportions, and lighting of the outfit to the person's pose and the scene's environment.`
        : `- Generate a new outfit for the person according to the '${outfitStyle}' style guide below. The outfit must look natural in the scene.`
    }
    - **Reconfirm HIGHEST PRIORITY:** The person's identity must be perfectly preserved as mandated above. The generated face must be an exact replica. There is zero tolerance for deviation.

3.  **Apply Photographic Properties & Fine Details:**
    - The final image must match the specific shot type instructions provided below.
    - **Masterful Re-lighting:** Re-light the person to match the scene's lighting conditions flawlessly. This includes replicating the direction, color temperature, and quality (hard vs. soft) of the primary light source, as well as accounting for bounced light and ambient occlusion. Create realistic specular highlights on skin and reflective surfaces.
    - **Accurate Shadows:** Create accurate, soft shadows that ground the person in the environment. The person must not appear to be floating. Their feet (if visible) must be firmly on the ground with realistic contact shadows and core shadows on the body.
    - **Cohesive Color Grading:** Apply professional color grading to the entire image for a unified, cinematic look. The person's skin tones must remain natural, accurate, and vibrant.
    
**Shot Type Specifications: ${shotType}**
${shotDetails}

${
  !isCustomOutfit
    ? `**Outfit Style Guide: ${outfitStyle}**\n${outfitStyleDetails[outfitStyle]}`
    : `**Outfit Style Guide: Custom**\nThe outfit is provided in the third input image. Adapt it realistically to the person and the scene.`
}

**Universal Quality Requirements - These are mandatory:**
- **Extreme Detail & Texture:** Generate extremely fine details. For the person, this includes realistic skin texture (pores, subtle lines, realistic sheen), individual hair strands with realistic flyaways, and crisp catchlights in the eyes. For clothing, render the precise texture of the fabric (e.g., the weave of denim, the sheen of silk, the knit of wool).
- **Impeccable Clarity & Sharpness:** The image must be tack sharp, especially on the subject's eyes. Avoid any digital softness, blurriness, or "painterly" effects. The focus falloff should be natural and consistent with the specified lens aperture.
- **Seamless Compositing:** No visible edges, halos, or color fringing. The blend between the person and the scene must be absolutely perfect and physically plausible.
- **Lighting & Shadow Perfection:** Lighting on the person must perfectly match the scene's source direction, color, and hardness. Shadows must be correctly cast, with soft penumbras and accurate contact shadows, firmly grounding the subject.
- **No Digital Artifacts:** The final image must be clean and pristine, with no compression artifacts, strange patterns, misplaced textures, or other tell-tale signs of AI generation.
`;
    
    const imageParts = [
      base64ToPart(sceneImage, sceneMimeType),
      base64ToPart(portraitImage, portraitMimeType),
    ];

    if (isCustomOutfit) {
        const outfitMimeType = customOutfitImage.match(/data:(.*);base64,/)?.[1] ?? 'image/jpeg';
        imageParts.push(base64ToPart(customOutfitImage, outfitMimeType));
    }
    
    const parts = [...imageParts, { text: prompt }];

    const ai = getAiClient(generationModel);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
        const base64ImageBytes = imagePart.inlineData.data;
        const mimeType = imagePart.inlineData.mimeType;
        return `data:${mimeType};base64,${base64ImageBytes}`;
    } else {
        const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
        if (textPart?.text) {
          console.error("API returned text instead of an image:", textPart.text);
        }
        throw new Error("No image was generated by the API. The model may have refused the request due to safety policies or inability to process the images. Please try different images.");
    }
  } catch (error) {
    console.error("Error generating photoshoot image:", error);
    if (error instanceof Error && (error.message.includes("No image was generated") || error.message.includes("API key"))) {
        throw error;
    }
    throw new Error("Failed to generate image. An unexpected error occurred. Please check the console for details.");
  }
};