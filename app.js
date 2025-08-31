// Social Media Content Analyzer
// Application Data Configuration
const appData = {
  socialMediaPlatforms: [
    {
      name: "Twitter",
      characterLimit: 280,
      bestPractices: [
        "Use hashtags sparingly",
        "Keep it concise",
        "Include engaging questions",
        "Use relevant emojis",
      ],
      optimalLength: "71-100 characters for higher engagement",
    },
    {
      name: "Facebook",
      characterLimit: 63206,
      bestPractices: [
        "Tell stories",
        "Use emotional hooks",
        "Include call-to-action",
        "Share behind-the-scenes content",
      ],
      optimalLength: "40-80 characters for posts, longer for stories",
    },
    {
      name: "Instagram",
      characterLimit: 2200,
      bestPractices: [
        "Use high-quality visuals",
        "Include relevant hashtags",
        "Write compelling captions",
        "Use Stories features",
      ],
      optimalLength: "125-150 characters work best",
    },
    {
      name: "LinkedIn",
      characterLimit: 3000,
      bestPractices: [
        "Share professional insights",
        "Use industry keywords",
        "Include actionable advice",
        "Engage with comments",
      ],
      optimalLength: "50-100 characters for updates",
    },
  ],
  sentimentKeywords: {
    positive: [
      "amazing",
      "excellent",
      "great",
      "fantastic",
      "wonderful",
      "love",
      "awesome",
      "perfect",
      "best",
      "incredible",
      "outstanding",
      "brilliant",
      "superb",
      "magnificent",
      "terrific",
      "good",
      "nice",
      "beautiful",
      "exciting",
      "happy",
      "success",
      "win",
      "achieve",
    ],
    negative: [
      "terrible",
      "awful",
      "horrible",
      "worst",
      "hate",
      "disgusting",
      "pathetic",
      "useless",
      "boring",
      "annoying",
      "frustrating",
      "disappointing",
      "bad",
      "poor",
      "dreadful",
      "sad",
      "angry",
      "upset",
      "wrong",
      "fail",
      "problem",
      "issue",
    ],
    neutral: [
      "okay",
      "average",
      "normal",
      "standard",
      "typical",
      "usual",
      "common",
      "regular",
      "moderate",
      "fair",
      "fine",
      "decent",
      "adequate",
      "acceptable",
      "neutral",
    ],
  },
  engagementTriggers: [
    "Ask questions to encourage comments",
    "Use emotional language to connect with audience",
    "Include call-to-action phrases",
    "Share personal experiences or stories",
    "Use trending hashtags relevant to your content",
    "Post during optimal engagement hours",
    "Include visual elements when possible",
    "Create urgency or exclusivity in your message",
  ],
  hashtagSuggestions: {
    business: [
      "#business",
      "#entrepreneur",
      "#marketing",
      "#success",
      "#leadership",
      "#innovation",
      "#startup",
      "#growth",
      "#strategy",
      "#professional",
    ],
    technology: [
      "#technology",
      "#tech",
      "#innovation",
      "#digital",
      "#ai",
      "#software",
      "#coding",
      "#development",
      "#programming",
      "#data",
    ],
    lifestyle: [
      "#lifestyle",
      "#wellness",
      "#health",
      "#fitness",
      "#motivation",
      "#inspiration",
      "#selfcare",
      "#mindfulness",
      "#balance",
      "#happiness",
    ],
    education: [
      "#education",
      "#learning",
      "#knowledge",
      "#skills",
      "#training",
      "#development",
      "#study",
      "#growth",
      "#teaching",
      "#school",
    ],
    travel: [
      "#travel",
      "#adventure",
      "#explore",
      "#wanderlust",
      "#vacation",
      "#journey",
      "#photography",
      "#culture",
      "#tourism",
      "#destination",
    ],
    creative: [
      "#creative",
      "#art",
      "#design",
      "#photography",
      "#content",
      "#inspiration",
      "#artistic",
      "#creativity",
      "#visual",
      "#aesthetic",
    ],
  },
};

// Global variables
let currentWorker = null;
let processedFiles = [];

// DOM elements - Initialize after DOM loads
let uploadArea,
  fileInput,
  selectFileBtn,
  browseBtn,
  processingSection,
  progressFill,
  progressText,
  resultsSection,
  extractedTextEl,
  fileError,
  contentMetrics,
  sentimentAnalysis,
  platformAnalysis,
  hashtagSuggestions,
  improvementSuggestions,
  extractedTextSection,
  copyBtn;

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing app...");
  initializeDOMElements();
  setupEventListeners();
  console.log("Social Media Content Analyzer initialized successfully");
});

// Initialize DOM element references
function initializeDOMElements() {
  uploadArea = document.getElementById("uploadArea");
  fileInput = document.getElementById("fileInput");
  selectFileBtn = document.getElementById("selectFileBtn");
  browseBtn = document.getElementById("browseBtn"); // Additional browse button
  processingSection = document.getElementById("processingSection");
  progressFill = document.getElementById("progressFill");
  progressText = document.getElementById("progressText");
  resultsSection = document.getElementById("resultsSection");
  extractedTextEl = document.getElementById("extractedText");
  extractedTextSection = document.getElementById("extractedTextSection");
  fileError = document.getElementById("fileError");
  contentMetrics = document.getElementById("contentMetrics");
  sentimentAnalysis = document.getElementById("sentimentAnalysis");
  platformAnalysis = document.getElementById("platformAnalysis");
  hashtagSuggestions = document.getElementById("hashtagSuggestions");
  improvementSuggestions = document.getElementById("improvementSuggestions");
  copyBtn = document.getElementById("copyBtn");

  console.log("DOM elements initialized:", {
    uploadArea: !!uploadArea,
    fileInput: !!fileInput,
    selectFileBtn: !!selectFileBtn,
    browseBtn: !!browseBtn,
  });
}

// Handlers
function handleSelectFileClick(e) {
  e.preventDefault();
  console.log("Select file button clicked");
  triggerFileInput();
}

function handleBrowseClick(e) {
  e.preventDefault();
  console.log("Browse button clicked");
  triggerFileInput();
}

function handleFileChange(e) {
  handleFileSelect(e);
}

// Set up all event listeners with duplicate prevention
function setupEventListeners() {
  try {
    if (selectFileBtn) {
      selectFileBtn.removeEventListener("click", handleSelectFileClick);
      selectFileBtn.addEventListener("click", handleSelectFileClick);
    }

    if (browseBtn) {
      browseBtn.removeEventListener("click", handleBrowseClick);
      browseBtn.addEventListener("click", handleBrowseClick);
    }

    if (fileInput) {
      fileInput.removeEventListener("change", handleFileChange);
      fileInput.addEventListener("change", handleFileChange);
      console.log("File input change listener added");
    }

    // Drag and drop events - FIXED
    if (uploadArea) {
      uploadArea.addEventListener("dragover", handleDragOver);
      uploadArea.addEventListener("drop", handleDrop);
      uploadArea.addEventListener("dragenter", handleDragEnter);
      uploadArea.addEventListener("dragleave", handleDragLeave);
      // Click on upload area to browse
      uploadArea.addEventListener("click", (e) => {
        // Only trigger if the click is directly on the upload area itself, not inner buttons/content
        if (e.target === uploadArea) {
          triggerFileInput();
        }
      });

      console.log("Drag and drop listeners added");
    }

    // Copy button functionality - FIXED
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const textToCopy = extractedTextEl?.textContent || "";
        if (textToCopy.trim()) {
          copyToClipboard(textToCopy);
        } else {
          showNotification("No text available to copy", "warning");
        }
      });
    }

    // Global copy button event delegation
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("btn--copy")) {
        const textToCopy = extractedTextEl?.textContent || "";
        if (textToCopy.trim()) {
          copyToClipboard(textToCopy);
        } else {
          showNotification("No text available to copy", "warning");
        }
      }
    });

    console.log("All event listeners set up successfully");
  } catch (error) {
    console.error("Error setting up event listeners:", error);
    showError("Error initializing application. Please refresh the page.");
  }
}

let fileDialogOpen = false;

//  Trigger file input with safeguard to avoid multiple dialogs
function triggerFileInput() {
  try {
    if (fileInput && !fileDialogOpen) {
      fileDialogOpen = true;
      console.log("Triggering file input click");
      fileInput.click();
    } else if (!fileInput) {
      console.error("File input element not found");
      showError("File upload not available. Please refresh the page.");
    }
  } catch (error) {
    console.error("Error triggering file input:", error);
    showError("Error opening file browser. Please try again.");
  }
}

// Reset flag when file dialog closes (select or cancel)
if (fileInput) {
  fileInput.addEventListener("change", (e) => {
    fileDialogOpen = false;
    handleFileSelect(e);
  });
}

// File handling functions
function handleFileSelect(event) {
  console.log("File select event triggered");
  const files = Array.from(event.target.files);
  console.log("Selected files:", files.length);

  if (files.length > 0) {
    processFiles(files);
  } else {
    console.log("No files selected");
  }

  // Reset file input to allow selecting the same file again
  if (fileInput) {
    fileInput.value = "";
  }
}

function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
}

function handleDragEnter(event) {
  event.preventDefault();
  event.stopPropagation();
  uploadArea?.classList.add("dragover");
  console.log("Drag enter");
}

function handleDragLeave(event) {
  event.preventDefault();
  event.stopPropagation();
  // Only remove dragover if we're leaving the upload area entirely
  if (!uploadArea?.contains(event.relatedTarget)) {
    uploadArea?.classList.remove("dragover");
    console.log("Drag leave");
  }
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  uploadArea?.classList.remove("dragover");

  const files = Array.from(event.dataTransfer.files);
  console.log("Files dropped:", files.length);

  if (files.length > 0) {
    processFiles(files);
  }
}

// Main file processing function
async function processFiles(files) {
  console.log("Processing files:", files.length);
  hideError();

  // Validate all files first
  for (const file of files) {
    const validation = validateFile(file);
    if (!validation.isValid) {
      showError(validation.error);
      return;
    }
  }

  showProcessing();
  processedFiles = []; // Reset processed files array

  try {
    let allExtractedText = "";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileNumber = i + 1;
      const totalFiles = files.length;

      console.log(`Processing file ${fileNumber}/${totalFiles}: ${file.name}`);
      updateProgress(
        (i / totalFiles) * 100,
        `Processing file ${fileNumber} of ${totalFiles}: ${file.name}`
      );

      let extractedText = "";
      let fileType = "unknown";

      try {
        if (file.type === "application/pdf") {
          fileType = "PDF";
          extractedText = await extractTextFromPDF(file);
        } else if (file.type.startsWith("image/")) {
          fileType = "Image";
          extractedText = await extractTextFromImage(file);
        } else {
          throw new Error(`Unsupported file type: ${file.type}`);
        }

        if (extractedText && extractedText.trim()) {
          const fileResult = {
            name: file.name,
            type: fileType,
            size: file.size,
            extractedText: extractedText.trim(),
            wordCount: extractedText.trim().split(/\s+/).length,
            charCount: extractedText.trim().length,
          };

          processedFiles.push(fileResult);
          allExtractedText += `--- File: ${
            file.name
          } (${fileType}) ---\n${extractedText.trim()}\n\n`;
          console.log(
            `Successfully extracted ${fileResult.wordCount} words from ${file.name}`
          );
        } else {
          console.warn(`No text extracted from ${file.name}`);
          processedFiles.push({
            name: file.name,
            type: fileType,
            size: file.size,
            extractedText: "",
            wordCount: 0,
            charCount: 0,
            error: "No text could be extracted",
          });
        }
      } catch (fileError) {
        console.error(`Error processing ${file.name}:`, fileError);
        processedFiles.push({
          name: file.name,
          type: fileType,
          size: file.size,
          extractedText: "",
          wordCount: 0,
          charCount: 0,
          error: fileError.message,
        });
      }

      // Update progress between files
      const fileProgress = (fileNumber / totalFiles) * 100;
      updateProgress(
        fileProgress,
        `Completed ${fileNumber} of ${totalFiles} files`
      );
    }

    updateProgress(100, "Processing complete!");

    if (allExtractedText.trim()) {
      displayResults(allExtractedText.trim());
      console.log("Results displayed successfully");
    } else {
      showError(
        "No text could be extracted from any of the uploaded files. Please ensure your files contain readable text or images with clear text."
      );
    }
  } catch (error) {
    console.error("Processing error:", error);
    showError(`Processing failed: ${error.message}`);
  } finally {
    hideProcessing();
  }
}

// File validation
function validateFile(file) {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/webp",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type "${file.type}" is not supported. Please upload PDF files or images (PNG, JPG, JPEG, GIF, BMP, TIFF, WebP).`,
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File "${file.name}" is too large (${(
        file.size /
        1024 /
        1024
      ).toFixed(1)}MB). Maximum file size is 10MB.`,
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: `File "${file.name}" appears to be empty.`,
    };
  }

  return { isValid: true };
}

// PDF text extraction using PDF.js
async function extractTextFromPDF(file) {
  try {
    updateProgress(10, "Loading PDF document...");

    // Check if PDF.js is loaded
    if (typeof pdfjsLib === "undefined") {
      throw new Error(
        "PDF.js library not loaded. Please check your internet connection."
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0, // Suppress console logs
    }).promise;

    updateProgress(30, "PDF loaded successfully. Extracting text...");

    let fullText = "";
    const numPages = pdf.numPages;

    if (numPages === 0) {
      throw new Error("PDF has no pages");
    }

    console.log(`PDF has ${numPages} pages`);

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Extract text with basic formatting
        const pageText = textContent.items
          .map((item) => {
            if (typeof item.str === "string") {
              return item.str;
            }
            return "";
          })
          .join(" ")
          .replace(/\s+/g, " ") // Normalize whitespace
          .trim();

        if (pageText) {
          fullText += `Page ${pageNum}:\n${pageText}\n\n`;
        }

        const progress = 30 + (pageNum / numPages) * 50;
        updateProgress(
          progress,
          `Extracting text from page ${pageNum} of ${numPages}`
        );

        console.log(
          `Extracted ${pageText.length} characters from page ${pageNum}`
        );
      } catch (pageError) {
        console.warn(`Error processing page ${pageNum}:`, pageError);
        // Continue with other pages
      }
    }

    updateProgress(80, "PDF text extraction completed");

    if (!fullText.trim()) {
      throw new Error(
        "No text content found in PDF. The document may contain only images or be password protected."
      );
    }

    return fullText.trim();
  } catch (error) {
    console.error("PDF extraction error:", error);
    if (error.message.includes("Invalid PDF")) {
      throw new Error(
        "Invalid PDF file. Please ensure the file is a valid PDF document."
      );
    } else if (error.message.includes("password")) {
      throw new Error(
        "Password-protected PDFs are not supported. Please upload an unprotected PDF."
      );
    } else {
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }
}

// OCR text extraction using Tesseract.js
async function extractTextFromImage(file) {
  try {
    updateProgress(10, "Initializing OCR engine...");

    // Check if Tesseract.js is loaded
    if (typeof Tesseract === "undefined") {
      throw new Error(
        "Tesseract.js library not loaded. Please check your internet connection."
      );
    }

    console.log("Starting OCR for:", file.name);

    //  Properly await the createWorker call for Tesseract.js v5+
    const worker = await Tesseract.createWorker("eng", 1, {
      logger: (m) => {
        console.log("OCR Progress:", m);
        if (m.status === "recognizing text") {
          const progress = Math.round(m.progress * 60) + 20; // Scale to 20-80%
          updateProgress(
            progress,
            `OCR Processing: ${Math.round(m.progress * 100)}%`
          );
        } else if (m.status === "loading tesseract core") {
          updateProgress(15, "Loading OCR engine...");
        } else if (m.status === "initializing tesseract") {
          updateProgress(18, "Initializing OCR...");
        }
      },
    });

    updateProgress(20, "OCR engine ready. Analyzing image...");

    // Perform OCR recognition
    const {
      data: { text, confidence },
    } = await worker.recognize(file);

    updateProgress(90, "OCR completed. Cleaning up...");

    // Clean up resources
    await worker.terminate();

    updateProgress(100, "OCR processing complete!");

    console.log(`OCR completed for ${file.name}. Confidence: ${confidence}%`);

    // Validate OCR results
    if (!text || text.trim().length < 3) {
      throw new Error(
        "No readable text found in the image. Please ensure the image contains clear, readable text."
      );
    }

    if (confidence < 30) {
      console.warn(
        `OCR confidence is low (${confidence}%). Results may be inaccurate.`
      );
      showNotification(
        `OCR confidence is low (${Math.round(
          confidence
        )}%). Results may need verification.`,
        "warning"
      );
    }

    return text.trim();
  } catch (error) {
    console.error("OCR Error:", error);
    if (error.message.includes("Invalid image")) {
      throw new Error(
        "Invalid image file. Please upload a valid image (PNG, JPG, GIF, etc.)."
      );
    } else if (error.message.includes("network")) {
      throw new Error(
        "Network error loading OCR engine. Please check your internet connection."
      );
    } else {
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }
}

// Results display with extracted text section
function displayResults(extractedText) {
  if (!extractedTextEl) return;

  console.log("Displaying results...");

  // Display extracted text in dedicated section
  extractedTextEl.textContent = extractedText;

  // Show file processing summary
  displayFileProcessingSummary();

  // Perform content analysis
  const analysis = analyzeContent(extractedText);
  displayAnalysis(analysis);

  // Show results section
  if (resultsSection) {
    resultsSection.classList.remove("hidden");
    resultsSection.scrollIntoView({ behavior: "smooth" });
  }

  // Show extracted text section
  if (extractedTextSection) {
    extractedTextSection.classList.remove("hidden");
  }

  console.log("Results displayed successfully");
}

// Display file processing summary
function displayFileProcessingSummary() {
  const summaryEl = document.getElementById("fileProcessingSummary");
  if (!summaryEl) return;

  const successfulFiles = processedFiles.filter((f) => !f.error);
  const failedFiles = processedFiles.filter((f) => f.error);

  let summaryHTML = `
    <div class="processing-summary">
      <h3>Processing Summary</h3>
      <div class="summary-stats">
        <div class="stat">
          <span class="stat-value">${processedFiles.length}</span>
          <span class="stat-label">Total Files</span>
        </div>
        <div class="stat">
          <span class="stat-value">${successfulFiles.length}</span>
          <span class="stat-label">Successful</span>
        </div>
        <div class="stat">
          <span class="stat-value">${failedFiles.length}</span>
          <span class="stat-label">Failed</span>
        </div>
      </div>
  `;

  if (successfulFiles.length > 0) {
    summaryHTML += `
      <div class="successful-files">
        <h4>Successfully Processed:</h4>
        <ul>
          ${successfulFiles
            .map(
              (file) => `
            <li>
              <strong>${file.name}</strong> (${file.type})
              <br><small>${file.wordCount} words, ${file.charCount} characters</small>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
  }

  if (failedFiles.length > 0) {
    summaryHTML += `
      <div class="failed-files">
        <h4>Failed to Process:</h4>
        <ul>
          ${failedFiles
            .map(
              (file) => `
            <li>
              <strong>${file.name}</strong> (${file.type})
              <br><small class="error-text">Error: ${file.error}</small>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
  }

  summaryHTML += "</div>";
  summaryEl.innerHTML = summaryHTML;
}

// Content analysis function (unchanged, but improved)
function analyzeContent(text) {
  const words = text.split(/\s+/).filter((word) => word.length > 0);
  const wordCount = words.length;
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, "").length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 WPM

  // Sentiment analysis
  const sentiment = analyzeSentiment(text);

  // Platform analysis
  const platformAnalysis = analyzePlatformFit(text);

  // Hashtag suggestions
  const hashtags = generateHashtags(text);

  // Engagement score
  const engagementScore = calculateEngagementScore(text, sentiment, words);

  return {
    wordCount,
    charCount,
    charCountNoSpaces,
    readingTime,
    sentiment,
    platformAnalysis,
    hashtags,
    engagementScore,
  };
}

// Sentiment analysis using keyword matching
function analyzeSentiment(text) {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Remove punctuation
    .split(/\s+/)
    .filter((word) => word.length > 2); // Filter short words

  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;

  words.forEach((word) => {
    if (appData.sentimentKeywords.positive.includes(word)) {
      positiveCount++;
    } else if (appData.sentimentKeywords.negative.includes(word)) {
      negativeCount++;
    } else if (appData.sentimentKeywords.neutral.includes(word)) {
      neutralCount++;
    }
  });

  const total = positiveCount + negativeCount + neutralCount;

  if (total === 0) {
    return {
      type: "neutral",
      score: 0,
      confidence: "low",
      details: "No sentiment keywords detected",
      breakdown: { positive: 0, negative: 0, neutral: 0 },
    };
  }

  const positiveRatio = positiveCount / total;
  const negativeRatio = negativeCount / total;
  const neutralRatio = neutralCount / total;

  let dominantType, dominantRatio;

  if (positiveRatio > negativeRatio && positiveRatio > neutralRatio) {
    dominantType = "positive";
    dominantRatio = positiveRatio;
  } else if (negativeRatio > positiveRatio && negativeRatio > neutralRatio) {
    dominantType = "negative";
    dominantRatio = negativeRatio;
  } else {
    dominantType = "neutral";
    dominantRatio = neutralRatio;
  }

  const confidence =
    dominantRatio > 0.6 ? "high" : dominantRatio > 0.4 ? "medium" : "low";

  return {
    type: dominantType,
    score: dominantRatio,
    confidence,
    details: `${positiveCount} positive, ${negativeCount} negative, ${neutralCount} neutral keywords`,
    breakdown: {
      positive: positiveCount,
      negative: negativeCount,
      neutral: neutralCount,
    },
  };
}

// Platform-specific analysis
function analyzePlatformFit(text) {
  return appData.socialMediaPlatforms.map((platform) => {
    const charCount = text.length;
    const fitsLimit = charCount <= platform.characterLimit;
    const efficiency = Math.min(
      100,
      (charCount / platform.characterLimit) * 100
    );

    let status = "good";
    if (!fitsLimit) {
      status = "warning";
    } else if (efficiency < 20) {
      status = "underutilized";
    }

    return {
      platform: platform.name,
      characterLimit: platform.characterLimit,
      currentLength: charCount,
      fitsLimit,
      efficiency: Math.round(efficiency),
      status,
      recommendations: platform.bestPractices.slice(0, 3),
      optimalLength: platform.optimalLength,
    };
  });
}

// Hashtag generation based on content analysis
function generateHashtags(text) {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3);

  const suggestedHashtags = [];

  // Check for category keywords and add relevant hashtags
  Object.entries(appData.hashtagSuggestions).forEach(([category, hashtags]) => {
    let categoryScore = 0;

    // Define category-specific keywords
    const categoryKeywords = {
      business: [
        "business",
        "company",
        "work",
        "professional",
        "career",
        "office",
        "meeting",
        "strategy",
        "growth",
        "revenue",
        "profit",
        "market",
        "sales",
      ],
      technology: [
        "tech",
        "software",
        "digital",
        "computer",
        "app",
        "code",
        "programming",
        "algorithm",
        "data",
        "artificial",
        "machine",
        "automation",
        "cloud",
      ],
      lifestyle: [
        "life",
        "healthy",
        "wellness",
        "fitness",
        "motivation",
        "inspire",
        "balance",
        "mindful",
        "exercise",
        "nutrition",
        "self",
        "personal",
        "happiness",
      ],
      education: [
        "learn",
        "study",
        "education",
        "knowledge",
        "skill",
        "training",
        "course",
        "teach",
        "university",
        "school",
        "student",
        "academic",
        "research",
      ],
      travel: [
        "travel",
        "trip",
        "vacation",
        "adventure",
        "journey",
        "explore",
        "destination",
        "flight",
        "hotel",
        "tourism",
        "culture",
        "experience",
        "visit",
      ],
      creative: [
        "creative",
        "design",
        "art",
        "photo",
        "video",
        "content",
        "artistic",
        "imagination",
        "innovative",
        "craft",
        "visual",
        "aesthetic",
        "beautiful",
      ],
    };

    const relevantKeywords = categoryKeywords[category] || [];

    // Calculate category relevance score
    words.forEach((word) => {
      if (
        relevantKeywords.some(
          (keyword) =>
            word.includes(keyword) ||
            keyword.includes(word) ||
            word.startsWith(keyword) ||
            keyword.startsWith(word)
        )
      ) {
        categoryScore++;
      }
    });

    // If category is relevant, add hashtags
    if (categoryScore > 0) {
      const hashtagsToAdd = hashtags.slice(
        0,
        Math.min(5, Math.ceil(categoryScore / 2) + 1)
      );
      suggestedHashtags.push(...hashtagsToAdd);
    }
  });

  // Remove duplicates and limit total hashtags
  return [...new Set(suggestedHashtags)].slice(0, 12);
}

// Engagement score calculation
function calculateEngagementScore(text, sentiment, words) {
  let score = 50; // Base score

  // Sentiment impact
  if (sentiment.type === "positive") {
    score += 25;
  } else if (sentiment.type === "negative") {
    score -= 15;
  }

  // Confidence impact
  if (sentiment.confidence === "high") {
    score += 5;
  } else if (sentiment.confidence === "low") {
    score -= 5;
  }

  // Length optimization
  const wordCount = words.length;
  if (wordCount >= 15 && wordCount <= 60) {
    score += 20; // Optimal length range
  } else if (wordCount < 5) {
    score -= 20; // Too short
  } else if (wordCount > 150) {
    score -= 15; // Too long
  }

  // Engagement elements
  const questionCount = (text.match(/\?/g) || []).length;
  score += Math.min(questionCount * 8, 20); // Questions encourage interaction

  const exclamationCount = (text.match(/!/g) || []).length;
  score += Math.min(exclamationCount * 4, 15); // Excitement/energy

  // Call-to-action phrases
  const ctaKeywords = [
    "share",
    "comment",
    "like",
    "follow",
    "subscribe",
    "click",
    "learn more",
    "read more",
    "check out",
    "tell me",
    "what do you think",
  ];
  const ctaCount = ctaKeywords.filter((keyword) =>
    text.toLowerCase().includes(keyword)
  ).length;
  score += Math.min(ctaCount * 10, 25);

  // Personal pronouns (increases relatability)
  const personalPronouns = ["i", "you", "we", "us", "our", "your", "my", "me"];
  const pronounCount = words.filter((word) =>
    personalPronouns.includes(word.toLowerCase())
  ).length;
  score += Math.min(pronounCount * 3, 15);

  // Emojis detection (basic)
  const emojiPattern =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
  const emojiCount = (text.match(emojiPattern) || []).length;
  score += Math.min(emojiCount * 5, 15);

  return Math.max(0, Math.min(100, Math.round(score)));
}

// Display analysis results in the UI
function displayAnalysis(analysis) {
  // Update content metrics
  if (contentMetrics) {
    const metricsHTML = `
      <div class="metric">
        <div class="metric__value">${analysis.wordCount.toLocaleString()}</div>
        <div class="metric__label">Words</div>
      </div>
      <div class="metric">
        <div class="metric__value">${analysis.charCount.toLocaleString()}</div>
        <div class="metric__label">Characters</div>
      </div>
      <div class="metric">
        <div class="metric__value">${analysis.readingTime}min</div>
        <div class="metric__label">Read Time</div>
      </div>
      <div class="metric metric--engagement">
        <div class="metric__value">${analysis.engagementScore}%</div>
        <div class="metric__label">Engagement Score</div>
      </div>
    `;
    contentMetrics.innerHTML = metricsHTML;
  }

  // Update sentiment analysis
  if (sentimentAnalysis) {
    const sentimentClass = `sentiment sentiment--${analysis.sentiment.type}`;
    const sentimentHTML = `
      <div class="${sentimentClass}">
        <div class="sentiment__header">
          <div class="sentiment__type">
            <span class="sentiment__icon">${
              analysis.sentiment.type === "positive"
                ? "😊"
                : analysis.sentiment.type === "negative"
                ? "😔"
                : "😐"
            }</span>
            ${
              analysis.sentiment.type.charAt(0).toUpperCase() +
              analysis.sentiment.type.slice(1)
            } Sentiment
          </div>
          <div class="sentiment__confidence">Confidence: ${
            analysis.sentiment.confidence
          }</div>
        </div>
        <div class="sentiment__score">Score: ${Math.round(
          analysis.sentiment.score * 100
        )}%</div>
        <div class="sentiment__details">${analysis.sentiment.details}</div>
        <div class="sentiment__breakdown">
          <small>
            Positive: ${analysis.sentiment.breakdown.positive} | 
            Negative: ${analysis.sentiment.breakdown.negative} | 
            Neutral: ${analysis.sentiment.breakdown.neutral}
          </small>
        </div>
      </div>
    `;
    sentimentAnalysis.innerHTML = sentimentHTML;
  }

  // Update platform analysis
  if (platformAnalysis) {
    const platformHTML = analysis.platformAnalysis
      .map(
        (platform) => `
      <div class="platform-card platform-card--${platform.status}">
        <div class="platform-card__header">
          <h4>${platform.platform}</h4>
          <span class="platform-card__status platform-card__status--${
            platform.status
          }">
            ${
              platform.fitsLimit ? "✅" : "⚠️"
            } ${platform.currentLength.toLocaleString()}/${platform.characterLimit.toLocaleString()}
          </span>
        </div>
        <div class="platform-card__efficiency">
          <div class="progress-bar progress-bar--small">
            <div class="progress-fill" style="width: ${Math.min(
              100,
              platform.efficiency
            )}%"></div>
          </div>
          <span>${platform.efficiency}% of character limit</span>
        </div>
        <div class="platform-card__optimal">
          <strong>Optimal Length:</strong> ${platform.optimalLength}
        </div>
        <div class="platform-card__recommendations">
          <strong>Best Practices:</strong>
          <ul>
            ${platform.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
          </ul>
        </div>
      </div>
    `
      )
      .join("");
    platformAnalysis.innerHTML = platformHTML;
  }

  // Update hashtag suggestions
  if (hashtagSuggestions) {
    const hashtagHTML =
      analysis.hashtags.length > 0
        ? `<div class="hashtag-container">
        <p class="hashtag-intro">Suggested hashtags based on your content:</p>
        ${analysis.hashtags
          .map(
            (tag) =>
              `<span class="hashtag" onclick="copyToClipboard('${tag}')" title="Click to copy">${tag}</span>`
          )
          .join("")}
        <p class="hashtag-note"><small>Click any hashtag to copy it to your clipboard</small></p>
      </div>`
        : '<div class="no-hashtags"><p>No relevant hashtags found. Try including more descriptive keywords, topics, or industry terms in your content.</p></div>';
    hashtagSuggestions.innerHTML = hashtagHTML;
  }

  // Update improvement suggestions
  if (improvementSuggestions) {
    const suggestions = generateImprovementSuggestions(analysis);
    const suggestionsHTML = suggestions
      .map(
        (suggestion) => `
      <div class="suggestion">
        <div class="suggestion__icon">${suggestion.icon}</div>
        <div class="suggestion__content">
          <h4>${suggestion.title}</h4>
          <p>${suggestion.description}</p>
          ${
            suggestion.action
              ? `<div class="suggestion__action">${suggestion.action}</div>`
              : ""
          }
        </div>
      </div>
    `
      )
      .join("");
    improvementSuggestions.innerHTML = suggestionsHTML;
  }
}

// Generate improvement suggestions based on analysis
function generateImprovementSuggestions(analysis) {
  const suggestions = [];

  // Length-based suggestions
  if (analysis.wordCount < 15) {
    suggestions.push({
      icon: "📝",
      title: "Expand Your Content",
      description:
        "Your content is quite brief. Consider adding more context, examples, or detailed explanations to provide greater value.",
      action: "Aim for 15-60 words for optimal engagement.",
    });
  } else if (analysis.wordCount > 150) {
    suggestions.push({
      icon: "✂️",
      title: "Simplify and Focus",
      description:
        "Long content can lose reader attention. Break it into shorter sections or focus on the most important points.",
      action: "Consider creating a series of posts or using bullet points.",
    });
  }

  // Sentiment-based suggestions
  if (
    analysis.sentiment.type === "negative" &&
    analysis.sentiment.confidence !== "low"
  ) {
    suggestions.push({
      icon: "💡",
      title: "Add Constructive Elements",
      description:
        "Balance negative sentiment by offering solutions, hope, or positive outcomes alongside the concerns.",
      action: "Include actionable advice or silver linings.",
    });
  } else if (
    analysis.sentiment.type === "neutral" ||
    analysis.sentiment.confidence === "low"
  ) {
    suggestions.push({
      icon: "🎭",
      title: "Inject Personality",
      description:
        "Add emotional elements like personal anecdotes, strong opinions, or passionate language to make your content more engaging.",
      action: "Use words that evoke emotion or share personal experiences.",
    });
  }

  // Engagement-specific suggestions
  if (analysis.engagementScore < 60) {
    suggestions.push({
      icon: "🚀",
      title: "Boost Interaction",
      description:
        "Increase engagement by asking questions, requesting opinions, or including clear calls-to-action.",
      action:
        'Try phrases like "What do you think?" or "Share your experience in the comments."',
    });
  }

  // Questions suggestion
  const questionCount = (extractedTextEl?.textContent.match(/\?/g) || [])
    .length;
  if (questionCount === 0) {
    suggestions.push({
      icon: "❓",
      title: "Ask Questions",
      description:
        "Questions are powerful engagement drivers. Add a thought-provoking question to encourage comments and discussion.",
      action: "End your post with a question related to your main topic.",
    });
  }

  // Platform-specific suggestions
  const twitterAnalysis = analysis.platformAnalysis.find(
    (p) => p.platform === "Twitter"
  );
  if (twitterAnalysis && !twitterAnalysis.fitsLimit) {
    suggestions.push({
      icon: "🐦",
      title: "Twitter Optimization",
      description: `Your content (${twitterAnalysis.currentLength} chars) exceeds Twitter's ${twitterAnalysis.characterLimit}-character limit.`,
      action:
        "Create a Twitter thread or condense your message to fit the platform.",
    });
  }

  // Hashtag suggestions
  if (analysis.hashtags.length < 3) {
    suggestions.push({
      icon: "#️⃣",
      title: "Improve Discoverability",
      description:
        "Add more specific keywords, industry terms, or topics to generate better hashtag recommendations.",
      action:
        "Include relevant terms that your target audience might search for.",
    });
  }

  // Engagement score specific suggestions
  if (analysis.engagementScore >= 80) {
    suggestions.push({
      icon: "🌟",
      title: "Excellent Content!",
      description:
        "Your content shows great engagement potential. Consider scheduling it during peak hours for maximum impact.",
      action: "Test different posting times and track performance metrics.",
    });
  }

  // If no specific suggestions, provide general advice
  if (suggestions.length === 0) {
    suggestions.push({
      icon: "✨",
      title: "Well-Balanced Content",
      description:
        "Your content has a good foundation. Consider experimenting with different formats, visuals, or posting schedules.",
      action: "A/B test different versions to optimize performance further.",
    });
  }

  return suggestions.slice(0, 4); // Limit to 4 suggestions max
}

// UI utility functions
function updateProgress(percentage, message) {
  const safePercentage = Math.max(0, Math.min(100, percentage));
  if (progressFill) {
    progressFill.style.width = `${safePercentage}%`;
  }
  if (progressText) {
    progressText.textContent =
      message || `${Math.round(safePercentage)}% complete`;
  }
}

function showProcessing() {
  if (processingSection) {
    processingSection.classList.remove("hidden");
    processingSection.scrollIntoView({ behavior: "smooth" });
  }
  if (resultsSection) {
    resultsSection.classList.add("hidden");
  }
  updateProgress(0, "Initializing...");
}

function hideProcessing() {
  if (processingSection) {
    processingSection.classList.add("hidden");
  }
}

function showError(message) {
  if (fileError) {
    fileError.innerHTML = `
      <div class="error-message">
        <span class="error-icon">⚠️</span>
        <span class="error-text">${message}</span>
      </div>
    `;
    fileError.classList.remove("hidden");
  }
  console.error("Application Error:", message);
}

function hideError() {
  if (fileError) {
    fileError.classList.add("hidden");
  }
}

// FIXED: Enhanced copy to clipboard functionality
async function copyToClipboard(text) {
  if (!text || !text.trim()) {
    showNotification("No text available to copy", "warning");
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      showNotification(
        `Copied to clipboard! (${text.length} characters)`,
        "success"
      );
    } else {
      // Fallback for older browsers or non-HTTPS
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 99999); // For mobile devices

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        showNotification(
          `Copied to clipboard! (${text.length} characters)`,
          "success"
        );
      } else {
        throw new Error("Copy command failed");
      }
    }
  } catch (err) {
    console.error("Failed to copy text:", err);
    showNotification(
      "Copy failed. Please select and copy the text manually.",
      "error"
    );

    // Try to select the text for manual copying
    if (extractedTextEl) {
      const range = document.createRange();
      range.selectNodeContents(extractedTextEl);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}

//  Show notification to user
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification--${type}`;

  const iconMap = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  notification.innerHTML = `
    <span class="notification__icon">${iconMap[type] || iconMap.info}</span>
    <span class="notification__message">${message}</span>
  `;

  // Add styles
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "16px 24px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "500",
    zIndex: "10000",
    maxWidth: "400px",
    minWidth: "300px",
    opacity: "0",
    transform: "translateX(100%)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  });

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.backgroundColor = "#10B981";
      break;
    case "error":
      notification.style.backgroundColor = "#EF4444";
      break;
    case "warning":
      notification.style.backgroundColor = "#F59E0B";
      break;
    default:
      notification.style.backgroundColor = "#3B82F6";
  }

  document.body.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  });

  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Error boundary for unhandled errors
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
  showError(
    "An unexpected error occurred. Please refresh the page and try again."
  );
  showNotification(
    "Unexpected error occurred. Check console for details.",
    "error"
  );
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  showError(
    "An unexpected error occurred during processing. Please try again."
  );
  showNotification("Processing error occurred. Please try again.", "error");
});

// Page visibility handling (pause processing when tab is not visible)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    console.log("Page hidden, pausing any background processing");
  } else {
    console.log("Page visible again");
  }
});

// Export functions for testing (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validateFile,
    analyzeSentiment,
    generateHashtags,
    calculateEngagementScore,
    analyzeContent,
    processFiles,
  };
}

console.log("Social Media Content Analyzer script loaded successfully");
