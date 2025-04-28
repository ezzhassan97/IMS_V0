// This script helps optimize the build process
console.log("Optimizing build process...")

// Clear cache before build
const fs = require("fs")
const path = require("path")

// Paths to clean
const pathsToClean = [".next/cache", "node_modules/.cache"]

pathsToClean.forEach((pathToClean) => {
  const fullPath = path.join(process.cwd(), pathToClean)
  if (fs.existsSync(fullPath)) {
    console.log(`Cleaning ${pathToClean}...`)
    fs.rmSync(fullPath, { recursive: true, force: true })
  }
})

console.log("Build optimization complete!")
