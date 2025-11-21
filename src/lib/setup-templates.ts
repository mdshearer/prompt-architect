/**
 * Setup Templates for Prompt Architect
 *
 * Contains setup instructions for each AI tool to guide users on how to
 * configure their AI assistant with the generated prompt.
 *
 * These are stored as TypeScript strings to avoid webpack loader issues with markdown files.
 *
 * @module setup-templates
 */

import type { AiTool } from '@/types/intake'

/**
 * Setup template for ChatGPT Projects
 */
const CHATGPT_TEMPLATE = `# How to Set Up Your ChatGPT Project

Follow these steps to create your personalized AI assistant in ChatGPT.

## Step 1: Open ChatGPT Projects

1. Go to chat.openai.com
2. Look for **"Projects"** in the left sidebar
3. Click **"New Project"** to create a new workspace

## Step 2: Name Your Project

Give your project a descriptive name that reflects its purpose.

**Suggested name:** "{{userRole}} Assistant" or "{{userBusiness}} Helper"

## Step 3: Add Custom Instructions

1. Click on the **project settings** (gear icon)
2. Find **"Custom Instructions"** section
3. **Copy and paste Section 2** (your ready-to-use prompt) into the instructions field
4. Click **Save**

## Step 4: Upload Relevant Files (Optional)

If you have documents that would help ChatGPT understand your work better:

1. Click **"Add files"** in your project
2. Upload documents like:
   - Style guides
   - Product information
   - Templates you use regularly
   - Reference materials

## Step 5: Start Your First Conversation

1. Open your new project
2. Start chatting! Your custom instructions are now active
3. ChatGPT will remember context within this project

---

## Tips for Best Results

- **Be specific** in your first message about what you need
- **Provide examples** when asking for a particular style or format
- **Use the project consistently** for related tasks to build context
- **Update instructions** as you learn what works best

## Need Help?

Your Prompt Architect instructions are designed to work immediately. If responses don't match your expectations, try:

1. Being more specific about the output format you want
2. Providing an example of ideal output
3. Adjusting the Golden Rules in your instructions`

/**
 * Setup template for Claude Projects
 */
const CLAUDE_TEMPLATE = `# How to Set Up Your Claude Project

Follow these steps to create your personalized AI assistant in Claude.

## Step 1: Open Claude Projects

1. Go to claude.ai
2. Look for **"Projects"** in the left sidebar (requires Claude Pro)
3. Click **"Create Project"** to start a new workspace

## Step 2: Name Your Project

Give your project a clear, descriptive name.

**Suggested name:** "{{userRole}} Assistant" or "{{userBusiness}} Helper"

## Step 3: Set Project Instructions

1. In your new project, click **"Project Settings"**
2. Find the **"Instructions"** or **"System Prompt"** section
3. **Copy and paste Section 2** (your ready-to-use prompt) into this field
4. Click **Save**

## Step 4: Add Project Knowledge (Optional)

Upload documents to give Claude deeper context about your work:

1. Click **"Add Content"** or **"Upload"** in your project
2. Add relevant files such as:
   - Company information or brand guidelines
   - Product documentation
   - Templates or examples
   - Reference materials

## Step 5: Start Using Your Project

1. Open your project from the sidebar
2. Begin a conversation - your instructions are now active
3. Claude will use your uploaded documents as reference

---

## Tips for Best Results

- **Start conversations with clear goals** - tell Claude exactly what you need
- **Reference uploaded documents** - mention specific files when relevant
- **Iterate on your instructions** - refine them as you learn what works
- **Use artifacts** for code, documents, and structured outputs

## Claude-Specific Features

Claude excels at:
- **Long-form writing** - detailed reports, articles, documentation
- **Analysis** - reviewing documents and providing insights
- **Nuanced responses** - understanding context and subtlety
- **Structured outputs** - tables, lists, organized content

## Need Help?

If Claude's responses don't match your expectations:

1. Try rephrasing your request with more specific details
2. Provide an example of the output format you want
3. Reference the Golden Rules in your instructions
4. Ask Claude to explain its reasoning`

/**
 * Setup template for Gemini Gems
 */
const GEMINI_TEMPLATE = `# How to Set Up Your Gemini Gem

Follow these steps to create your personalized AI assistant as a Gem in Google Gemini.

## Step 1: Open Gemini Gems

1. Go to gemini.google.com
2. Look for **"Gem manager"** in the left sidebar (requires Gemini Advanced)
3. Click **"New Gem"** to create your custom AI

## Step 2: Name Your Gem

Choose a name that reflects what your Gem does.

**Suggested name:** "{{userRole}} Assistant" or "{{userBusiness}} Helper"

## Step 3: Add Your Instructions

1. In the Gem creation screen, find the **"Instructions"** text area
2. **Copy and paste Section 2** (your ready-to-use prompt) into this field
3. This tells your Gem how to behave and respond

## Step 4: Customize Your Gem (Optional)

- **Add a description** - helps you remember what this Gem is for
- **Choose an icon** - makes it easy to find in your Gem list
- **Test your Gem** - try a few prompts before saving

## Step 5: Save and Use Your Gem

1. Click **"Save"** to create your Gem
2. Find your Gem in the Gem manager sidebar
3. Click on it to start a conversation with your personalized AI

---

## Tips for Best Results

- **Start fresh conversations** for new topics - Gems work best with focused discussions
- **Be specific** about what you need in each message
- **Use Gemini's strengths** - real-time information, Google integration
- **Iterate on instructions** - edit your Gem as you learn what works

## Gemini-Specific Features

Your Gem can leverage:
- **Real-time information** - current events, recent data
- **Google Workspace integration** - connect with Docs, Sheets, etc.
- **Image understanding** - upload and discuss images
- **Web search** - find and synthesize information

## Need Help?

If your Gem's responses aren't quite right:

1. Edit your Gem's instructions to be more specific
2. Add examples of the output style you want
3. Test different phrasings for your requests
4. Remember that Gems reset context with each new conversation`

/**
 * Map of AI tools to their setup templates
 */
const TEMPLATES: Partial<Record<AiTool, string>> = {
  chatgpt: CHATGPT_TEMPLATE,
  claude: CLAUDE_TEMPLATE,
  gemini: GEMINI_TEMPLATE
}

/**
 * Gets the setup template for a specific AI tool
 *
 * @param aiTool - The AI tool to get the template for
 * @returns The setup template as a string, or null if no template exists
 */
export function getSetupTemplate(aiTool: AiTool): string | null {
  return TEMPLATES[aiTool] || null
}

/**
 * Substitutes placeholder variables in the template
 *
 * @param template - The template string with {{placeholders}}
 * @param role - The user's role to substitute
 * @param business - The user's business to substitute
 * @returns The template with placeholders replaced
 */
export function substituteTemplateVariables(
  template: string,
  role: string,
  business: string
): string {
  return template
    .replace(/\{\{userRole\}\}/g, role)
    .replace(/\{\{userBusiness\}\}/g, business)
}
