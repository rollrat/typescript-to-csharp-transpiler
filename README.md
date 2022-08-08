# Typescript to C# Transpiler

This will be and can be used limited circumstances.

EX: https://github.com/rollrat/typescript-to-csharp-transpiler/blob/master/EX.md

## This transpiler follow this step

1. Build Typescript AST

   - using bable typescript plugin

2. Traverse AST And Transform to Restrict Format

   - convert ts code to easy to convert to c#.
   - ex) flatting object pattern variable declartion...

<!-- 2. Semantic Analysis (Semantic)

   - process adding necessary modules and module context linkage, type inference, type lowering
   - finds a type or syntax that cannot be transpiled
   - these are later split into override functions or return an error to the user

3. Static Analysis (Analysis)

   - find expensive methods or loops. -->

3. Code Transform for Optimizing (Transform)

   - remove unnecessary code and optimize code
   - like loop unroll etc...

4. Emit to CSharp Code (Emitter)
