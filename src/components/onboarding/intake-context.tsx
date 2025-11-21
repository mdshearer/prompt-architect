'use client'

/**
 * Intake Flow Context Provider
 *
 * Manages all state for the onboarding intake flow, including:
 * - Current step (1-3)
 * - Selected AI tool and prompt type
 * - User's initial thoughts input
 * - Loading and error states
 * - Generated output
 *
 * Uses cookie-manager for persistence across sessions.
 *
 * @module intake-context
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode
} from 'react'
import type {
  AiTool,
  PromptType,
  IntakeCookie,
  FormattedOutput
} from '@/types/intake'
import {
  getCookie,
  setCookie,
  clearCookie,
  createIntakeSession
} from '@/lib/cookie-manager'
import { logger } from '@/lib/logger'

/**
 * Current state of the intake flow
 */
export interface IntakeState {
  /** Current step in the flow (1 = AI tool, 2 = prompt type, 3 = initial thoughts) */
  step: 1 | 2 | 3
  /** Selected AI tool (null if not yet selected) */
  aiTool: AiTool | null
  /** Selected prompt type (null if not yet selected) */
  promptType: PromptType | null
  /** User's initial thoughts input */
  userThoughts: string
  /** Whether an API call is in progress */
  isLoading: boolean
  /** Error message from last operation */
  error: string | null
  /** Generated output from the intake API */
  output: FormattedOutput | null
  /** Whether intake has been completed */
  intakeCompleted: boolean
  /** Session ID for tracking */
  sessionId: string | null
}

/**
 * Context value with state and methods
 */
export interface IntakeContextType extends IntakeState {
  /** Set the selected AI tool */
  setAiTool: (tool: AiTool) => void
  /** Set the selected prompt type */
  setPromptType: (type: PromptType) => void
  /** Update the user's thoughts input */
  setUserThoughts: (thoughts: string) => void
  /** Navigate to a specific step */
  goToStep: (step: 1 | 2 | 3) => void
  /** Submit the intake form and generate output */
  submitIntake: () => Promise<void>
  /** Reset the entire intake flow */
  resetIntake: () => void
  /** Clear error state */
  clearError: () => void
}

// Create context with null default
const IntakeContext = createContext<IntakeContextType | null>(null)

/**
 * Initial state for a fresh intake flow
 */
const initialState: IntakeState = {
  step: 1,
  aiTool: null,
  promptType: null,
  userThoughts: '',
  isLoading: false,
  error: null,
  output: null,
  intakeCompleted: false,
  sessionId: null
}

/**
 * Props for the IntakeProvider component
 */
interface IntakeProviderProps {
  children: ReactNode
}

/**
 * Provider component for the Intake Flow context
 *
 * Wraps the intake flow components and provides state management.
 * Automatically loads existing session data from cookies on mount.
 *
 * @example
 * <IntakeProvider>
 *   <IntakeFlow />
 * </IntakeProvider>
 */
export function IntakeProvider({ children }: IntakeProviderProps) {
  const [state, setState] = useState<IntakeState>(initialState)

  // Load existing session on mount
  useEffect(() => {
    const existingCookie = getCookie()
    if (existingCookie) {
      logger.info('Loaded existing intake session', { sessionId: existingCookie.sessionId })
      setState(prev => ({
        ...prev,
        aiTool: existingCookie.aiTool,
        promptType: existingCookie.promptType,
        intakeCompleted: existingCookie.intakeCompleted,
        sessionId: existingCookie.sessionId,
        // If intake was completed, skip to a "completed" state
        step: existingCookie.intakeCompleted ? 3 : prev.step
      }))
    } else {
      // Create new session
      const newSession = createIntakeSession()
      setState(prev => ({
        ...prev,
        sessionId: newSession.sessionId
      }))
    }
  }, [])

  /**
   * Updates the cookie with current state
   */
  const updateCookie = useCallback((updates: Partial<IntakeCookie>) => {
    const existingCookie = getCookie()
    if (existingCookie) {
      setCookie({
        ...existingCookie,
        ...updates,
        timestamp: new Date().toISOString()
      })
    }
  }, [])

  /**
   * Set the selected AI tool and advance to step 2
   */
  const setAiTool = useCallback((tool: AiTool) => {
    setState(prev => ({
      ...prev,
      aiTool: tool,
      step: 2,
      // Reset prompt type when changing AI tool (available types may differ)
      promptType: null
    }))
    updateCookie({ aiTool: tool })
    logger.info('AI tool selected', { tool })
  }, [updateCookie])

  /**
   * Set the selected prompt type and advance to step 3
   */
  const setPromptType = useCallback((type: PromptType) => {
    setState(prev => ({
      ...prev,
      promptType: type,
      step: 3
    }))
    updateCookie({ promptType: type })
    logger.info('Prompt type selected', { type })
  }, [updateCookie])

  /**
   * Update the user's thoughts input (no cookie update for privacy)
   */
  const setUserThoughts = useCallback((thoughts: string) => {
    setState(prev => ({
      ...prev,
      userThoughts: thoughts,
      error: null // Clear any validation errors as user types
    }))
  }, [])

  /**
   * Navigate to a specific step (supports back navigation)
   */
  const goToStep = useCallback((step: 1 | 2 | 3) => {
    // Validate step number
    if (![1, 2, 3].includes(step)) {
      logger.warn('Invalid step number', { step })
      return
    }

    setState(prev => ({
      ...prev,
      step,
      error: null
    }))
    logger.info('Navigated to step', { step })
  }, [])

  /**
   * Submit the intake form and call the API
   */
  const submitIntake = useCallback(async () => {
    const { aiTool, promptType, userThoughts } = state

    // Validate all required fields
    if (!aiTool || !promptType) {
      setState(prev => ({
        ...prev,
        error: 'Please select an AI tool and prompt type'
      }))
      return
    }

    if (!userThoughts || userThoughts.trim().length < 20) {
      setState(prev => ({
        ...prev,
        error: 'Please enter at least 20 characters'
      }))
      return
    }

    // Set loading state
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/chat/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aiTool,
          promptType,
          userThoughts: userThoughts.trim()
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate output')
      }

      // Success - update state with output
      setState(prev => ({
        ...prev,
        isLoading: false,
        output: data.output,
        intakeCompleted: true
      }))

      // Update cookie to mark intake as completed
      updateCookie({ intakeCompleted: true })

      logger.info('Intake submitted successfully', { aiTool, promptType })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      logger.error('Intake submission failed', error)
    }
  }, [state, updateCookie])

  /**
   * Reset the entire intake flow to initial state
   */
  const resetIntake = useCallback(() => {
    // Clear cookie and localStorage
    clearCookie()

    // Create new session
    const newSession = createIntakeSession()

    // Reset state
    setState({
      ...initialState,
      sessionId: newSession.sessionId
    })

    logger.info('Intake reset')
  }, [])

  /**
   * Clear current error message
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Combine state and methods for context value
  const contextValue: IntakeContextType = {
    ...state,
    setAiTool,
    setPromptType,
    setUserThoughts,
    goToStep,
    submitIntake,
    resetIntake,
    clearError
  }

  return (
    <IntakeContext.Provider value={contextValue}>
      {children}
    </IntakeContext.Provider>
  )
}

/**
 * Custom hook to access the Intake context
 *
 * Must be used within an IntakeProvider.
 *
 * @throws Error if used outside of IntakeProvider
 *
 * @example
 * function MyComponent() {
 *   const { step, aiTool, setAiTool } = useIntake()
 *   // ...
 * }
 */
export function useIntake(): IntakeContextType {
  const context = useContext(IntakeContext)

  if (!context) {
    throw new Error('useIntake must be used within an IntakeProvider')
  }

  return context
}
