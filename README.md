# Typescript to C# Transpiler

This will be and can be used limited circumstances.

## This transfiler follow this step

1. Build Typescript AST

   - using bable typescript plugin

2. Sementic Analysis

   - process adding necessary modules and module context linkage, type inference, type lowering
   - finds a type or syntax that cannot be transpiled
   - these are later split into override functions or return an error to the user

3. Static Analysis

   - find expensive methods or loops.

4. Code Transform for Optimizing

   - remove unnecessary code and optimize code
   - like loop unroll etc...

5. Emit to CSharp Code
