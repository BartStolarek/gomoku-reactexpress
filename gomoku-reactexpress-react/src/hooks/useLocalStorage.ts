import { useState } from 'react'

export default function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize state with either the stored value from localStorage or the provided initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Ensure this runs only in a browser environment
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      // Retrieve the value from localStorage
      const item = window.localStorage.getItem(key)
      // If a stored value exists, parse and return it; otherwise, return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Log and return initialValue in case of any errors
      console.log(error)
      return initialValue
    }
  })

  // Custom setter function that also updates localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Use the function form of the value if provided to ensure consistency with useState's API
      const valueToStore = 
        value instanceof Function ? value(storedValue) : value
      // Update the state
      setStoredValue(valueToStore)
      
      // Persist the new value to localStorage, but only in a browser environment
      if (typeof window !== 'undefined') {
        if (value === undefined) {
          window.localStorage.removeItem(key) // Remove the item if value is undefined
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      }
    } catch (error) {
      // Handle or log any errors that occur when trying to update state or localStorage
      console.log(error)
    }
  }

  // Return the stored value and the custom setter function
  return [storedValue, setValue] as const
}
