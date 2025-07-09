# Copilot Instructions

## How to convert a TypeScript project to JavaScript

When asked to convert a TypeScript project to JavaScript, follow these comprehensive steps:

### 1. Analysis Phase
- **Identify TypeScript files**: Look for `.ts` and `.tsx` files in the project
- **Check configuration files**: Examine `tsconfig.json`, `package.json`, and build scripts
- **Identify dependencies**: Note TypeScript-specific dependencies and type definitions
- **Document project structure**: Understand the current directory structure and module organization

### 2. Configuration File Updates

#### Update package.json
- Remove TypeScript from `dependencies` and `devDependencies`:
  - Remove `typescript`
  - Remove `@types/*` packages
  - Remove `ts-node`, `ts-loader`, etc.
- Update scripts:
  - Replace `tsc` commands with appropriate JavaScript build tools
  - Change `ts-node` to `node`
  - Update test scripts if they reference TypeScript files
  - **Ensure all scripts from the original TypeScript package.json are preserved and updated for JavaScript compatibility.**
- **Copy all dependencies from the TypeScript version to the JavaScript version, excluding TypeScript-specific ones.**
- Add JavaScript linting/formatting tools if needed:
  - Consider adding `eslint` with JavaScript configuration
  - Add `prettier` for code formatting

#### Remove TypeScript configuration
- Delete `tsconfig.json` file
- Remove any TypeScript-specific configuration files (`tsconfig.*.json`)

### 3. File Conversion Process

#### Convert TypeScript files to JavaScript
For each `.ts` file:
- Rename `.ts` files to `.js` and `.tsx` files to `.jsx` (if using React).
- **Ensure all source files in the `./src` directory are converted and retain the same functionality as the TypeScript files.**
- **Ensure authentication mechanisms are preserved and adapted for JavaScript.**
- **Compare each converted file with its TypeScript counterpart to ensure all functionality is preserved.**
- Remove all TypeScript-specific syntax:
  - **Type annotations**: Remove `: string`, `: number`, `: boolean`, etc.
  - **Interface definitions**: Remove `interface` declarations
  - **Type aliases**: Remove `type` declarations
  - **Generic type parameters**: Remove `<T>`, `<K, V>`, etc.
  - **Access modifiers**: Remove `public`, `private`, `protected`
  - **Type assertions**: Remove `as SomeType` or `<SomeType>`
  - **Enum declarations**: Convert to objects or constants
  - **Abstract classes**: Convert to regular classes
  - **Readonly modifiers**: Remove `readonly` keyword
  - **Optional properties**: Remove `?` from property definitions
  - **Union types**: Remove type unions like `string | number`

#### Specific syntax transformations
- **Function parameters**: 
  ```typescript
  function example(name: string, age: number): void
  ```
  Becomes:
  ```javascript
  function example(name, age)
  ```

- **Class properties**:
  ```typescript
  class User {
    private name: string;
    public age: number;
  }
  ```
  Becomes:
  ```javascript
  class User {
    constructor() {
      this.name = '';
      this.age = 0;
    }
  }
  ```

- **Interface to object pattern**:
  ```typescript
  interface Config {
    apiUrl: string;
    timeout: number;
  }
  ```
  Becomes (if needed as documentation):
  ```javascript
  // Config object structure:
  // {
  //   apiUrl: string,
  //   timeout: number
  // }
  ```

- **Enums to objects**:
  ```typescript
  enum Status {
    PENDING = 'pending',
    COMPLETED = 'completed'
  }
  ```
  Becomes:
  ```javascript
  const Status = {
    PENDING: 'pending',
    COMPLETED: 'completed'
  };
  ```

### 4. Import/Export Updates

#### Update import statements
- Remove type imports: `import type { SomeType } from './types'`
- Update file extensions in imports:
  - Change `from './file'` to `from './file.js'` if using ES modules
  - Update any imports referencing `.ts` files to `.js`

#### Update export statements
- Remove type exports: `export type { SomeType }`
- Ensure all exports are value exports

### 5. Build System Updates

#### Update build configuration
- Remove TypeScript compiler configurations
- Update webpack/rollup/vite configs to handle JavaScript instead of TypeScript
- Remove TypeScript loaders and plugins
- Update entry points from `.ts` to `.js` files

#### Update testing configuration
- Update test file patterns from `*.ts` to `*.js`
- Remove TypeScript preprocessing from test configurations
- Update Jest/Mocha configurations to work with JavaScript

### 6. Documentation and Comments

#### Add JSDoc comments
Replace TypeScript type information with JSDoc comments where helpful:
```javascript
/**
 * Processes user data
 * @param {string} name - The user's name
 * @param {number} age - The user's age
 * @returns {Object} The processed user object
 */
function processUser(name, age) {
  return { name, age, processed: true };
}
```

#### Update README files
- Remove TypeScript-specific installation instructions
- Update build commands
- Remove references to TypeScript in documentation

### 7. Runtime Considerations

#### Add runtime type checking (optional)
Consider adding libraries for runtime validation:
- `joi` for schema validation
- `yup` for object schema validation
- `prop-types` for React component props

#### Error handling
Add appropriate error handling for cases where TypeScript would have caught type errors:
```javascript
function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}
```

### 8. Final Steps

#### Verification
- Run the JavaScript version to ensure it works
- Test all functionality that was previously working
- Check that all imports/exports resolve correctly
- Verify build processes complete successfully

#### Cleanup
- Remove any remaining TypeScript-related files
- Update `.gitignore` to remove TypeScript build artifacts
- Clean up any TypeScript-specific IDE configurations

#### Performance optimization
- Consider adding minification for production builds
- Optimize bundle sizes without TypeScript overhead
- Update deployment scripts if necessary

### 9. Common Pitfalls to Avoid

- **Don't remove necessary runtime logic**: Sometimes TypeScript types correspond to runtime behavior
- **Preserve JSDoc comments**: They provide valuable documentation
- **Test thoroughly**: JavaScript won't catch type errors at compile time
- **Update all file references**: Ensure imports point to `.js` files
- **Check third-party integrations**: Some tools may need reconfiguration

### 10. Example Conversion Commands

When using tools, follow this sequence:
1. `file_search` to find all TypeScript files
2. `read_file` to examine TypeScript configuration
3. `replace_string_in_file` to update package.json
4. `run_in_terminal` to remove TypeScript dependencies
5. For each TypeScript file:
   - `read_file` to get current content
   - `create_file` to create JavaScript version
   - Remove the TypeScript file
6. `run_in_terminal` to test the conversion
7. `get_errors` to check for any issues

This systematic approach ensures a complete and reliable conversion from TypeScript to JavaScript.

