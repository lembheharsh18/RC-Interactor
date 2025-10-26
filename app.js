// Question data with input formats
const questions = [
    { 
        id: 1, 
        name: "Q1", 
        description: "Number Pattern Analysis",
        inputFormat: "Single integer N (1 ≤ N ≤ 1000)",
        type: "number"
    },
    { 
        id: 2, 
        name: "Q2", 
        description: "Mathematical Sequence Challenge",
        inputFormat: "Single integer N (0 ≤ N ≤ 100)",
        type: "number"
    },
    { 
        id: 3, 
        name: "Q3", 
        description: "String Transformation",
        inputFormat: "A single string S (1 ≤ |S| ≤ 1000)",
        type: "string"
    },
    { 
        id: 4, 
        name: "Q4", 
        description: "Array Operations",
        inputFormat: "First line: integer N (size of array)\nNext N lines: array elements (integers)",
        type: "array"
    },
    { 
        id: 5, 
        name: "Q5", 
        description: "Graph Traversal",
        inputFormat: "First line: V E (vertices and edges)\nNext E lines: u v (edges between vertices)",
        type: "graph"
    },
    { 
        id: 6, 
        name: "Q6", 
        description: "Binary Operations",
        inputFormat: "Two integers A and B (0 ≤ A, B ≤ 1000)",
        type: "two-numbers"
    },
    { 
        id: 7, 
        name: "Q7", 
        description: "Matrix Operations",
        inputFormat: "First line: R C (rows and columns)\nNext R lines: C space-separated integers",
        type: "matrix"
    },
    { 
        id: 8, 
        name: "Q8", 
        description: "Number Theory Problem",
        inputFormat: "Single integer N (1 ≤ N ≤ 10^6)",
        type: "number"
    },
    { 
        id: 9, 
        name: "Q9", 
        description: "String Pattern Matching",
        inputFormat: "Two strings S and T separated by space",
        type: "two-strings"
    },
    { 
        id: 10, 
        name: "Q10", 
        description: "Advanced Sequence",
        inputFormat: "Single integer N (1 ≤ N ≤ 100)",
        type: "number"
    }
];

let currentQuestionId = null;

// Initialize question buttons
const questionGrid = document.getElementById('questionGrid');
questions.forEach(question => {
    const button = document.createElement('button');
    button.className = 'question-btn';
    button.textContent = question.name;
    button.dataset.id = question.id;
    button.addEventListener('click', () => selectQuestion(question.id));
    questionGrid.appendChild(button);
});

// Select a question
function selectQuestion(questionId) {
    currentQuestionId = questionId;
    
    // Update UI
    document.querySelectorAll('.question-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.question-btn[data-id="${questionId}"]`).classList.add('active');
    
    const question = questions.find(q => q.id === questionId);
    document.getElementById('currentQuestion').textContent = 
        `Current Question: ${question.name} - ${question.description}`;
    
    document.getElementById('inputFormat').textContent = 
        `Input Format: ${question.inputFormat}`;
    
    document.getElementById('userInput').placeholder = 
        `Enter input for ${question.name} according to the specified format...`;
    
    // Clear previous output
    document.getElementById('output').textContent = "Output will appear here...";
}

// Run button click handler
document.getElementById('runBtn').addEventListener('click', function() {
    if (!currentQuestionId) {
        alert("Please select a question first.");
        return;
    }
    
    const userInput = document.getElementById('userInput').value.trim();
    const outputElement = document.getElementById('output');
    
    if (!userInput) {
        outputElement.innerHTML = "<span class='error'>Please provide input to test.</span>";
        return;
    }
    
    // Show loading state
    outputElement.textContent = "Processing... ";
    
    // Simulate processing delay
    setTimeout(() => {
        try {
            // Validate input first
            const validationResult = validateInput(currentQuestionId, userInput);
            if (!validationResult.valid) {
                outputElement.innerHTML = `<span class='error'>${validationResult.message}</span>`;
                return;
            }
            
            // Process the input with the specific question processor
            const result = processQuestion(currentQuestionId, userInput);
            outputElement.innerHTML = `<span class='success'>${result}</span>`;
        } catch (error) {
            outputElement.innerHTML = `<span class='error'>Error: ${error.message}</span>`;
        }
    }, 800);
});

// Input validation based on question type
function validateInput(questionId, input) {
    const question = questions.find(q => q.id === questionId);
    
    switch(question.type) {
        case "number": {
            const num = parseInt(input);
            if (isNaN(num)) {
                return { valid: false, message: "Invalid input. Please provide a valid integer." };
            }
            // Per-question numeric constraints
            let min = 1, max = 1000;
            if (questionId === 2) { // Q2: 0 ≤ N ≤ 100
                min = 0; max = 100;
            } else if (questionId === 8) { // Q8: 1 ≤ N ≤ 10^6
                min = 1; max = 1_000_000;
            } else if (questionId === 10) { // Q10: 1 ≤ N ≤ 100
                min = 1; max = 100;
            } else if (questionId === 1) { // Q1: 1 ≤ N ≤ 1000
                min = 1; max = 1000;
            }
            if (num < min || num > max) {
                return { valid: false, message: "input entered is out of constraints" };
            }
            break;
        }
            
        case "string":
            if (input.length === 0) {
                return { valid: false, message: "Invalid input. Please provide a non-empty string." };
            }
            if (input.length > 1000) {
                return { valid: false, message: "input entered is out of constraints" };
            }
            break;
            
        case "array":
            const lines = input.split('\n').filter(line => line.trim() !== '');
            if (lines.length < 1) {
                return { valid: false, message: "Invalid input. Please provide array size and elements." };
            }
            
            const size = parseInt(lines[0]);
            if (isNaN(size) || size < 1) {
                return { valid: false, message: "Invalid array size. Please provide a positive integer." };
            }
            
            if (lines.length !== size + 1) {
                return { valid: false, message: `Invalid input. Expected ${size + 1} lines (size + elements), got ${lines.length}.` };
            }
            
            for (let i = 1; i <= size; i++) {
                if (isNaN(parseInt(lines[i]))) {
                    return { valid: false, message: `Invalid array element at line ${i+1}. Please provide integers only.` };
                }
            }
            break;
            
        case "graph":
            const graphLines = input.split('\n').filter(line => line.trim() !== '');
            if (graphLines.length < 1) {
                return { valid: false, message: "Invalid input. Please provide vertices, edges, and edge list." };
            }
            
            const firstLine = graphLines[0].split(' ').filter(x => x !== '');
            if (firstLine.length !== 2) {
                return { valid: false, message: "Invalid first line. Please provide 'V E' (vertices and edges)." };
            }
            
            const V = parseInt(firstLine[0]);
            const E = parseInt(firstLine[1]);
            
            if (isNaN(V) || isNaN(E) || V < 1 || E < 0) {
                return { valid: false, message: "Invalid vertices or edges count. V should be ≥ 1, E should be ≥ 0." };
            }
            
            if (graphLines.length !== E + 1) {
                return { valid: false, message: `Invalid input. Expected ${E + 1} lines (V E + edges), got ${graphLines.length}.` };
            }
            
            for (let i = 1; i <= E; i++) {
                const edge = graphLines[i].split(' ').filter(x => x !== '');
                if (edge.length !== 2) {
                    return { valid: false, message: `Invalid edge at line ${i+1}. Please provide 'u v' format.` };
                }
                const u = parseInt(edge[0]);
                const v = parseInt(edge[1]);
                if (isNaN(u) || isNaN(v) || u < 0 || u >= V || v < 0 || v >= V) {
                    return { valid: false, message: `Invalid vertex in edge at line ${i+1}. Vertices should be between 0 and ${V-1}.` };
                }
            }
            break;
            
        case "two-numbers": {
            const nums = input.split(' ').filter(x => x !== '');
            if (nums.length !== 2) {
                return { valid: false, message: "Invalid input. Please provide exactly two integers separated by space." };
            }
            const a = parseInt(nums[0]);
            const b = parseInt(nums[1]);
            if (isNaN(a) || isNaN(b)) {
                return { valid: false, message: "Invalid input. Please provide exactly two integers separated by space." };
            }
            if (a < 0 || a > 1000 || b < 0 || b > 1000) {
                return { valid: false, message: "input entered is out of constraints" };
            }
            break;
        }
            
        case "matrix":
            const matrixLines = input.split('\n').filter(line => line.trim() !== '');
            if (matrixLines.length < 1) {
                return { valid: false, message: "Invalid input. Please provide matrix dimensions and elements." };
            }
            
            const dims = matrixLines[0].split(' ').filter(x => x !== '');
            if (dims.length !== 2) {
                return { valid: false, message: "Invalid first line. Please provide 'R C' (rows and columns)." };
            }
            
            const R = parseInt(dims[0]);
            const C = parseInt(dims[1]);
            
            if (isNaN(R) || isNaN(C) || R < 1 || C < 1) {
                return { valid: false, message: "Invalid matrix dimensions. R and C should be positive integers." };
            }
            
            if (matrixLines.length !== R + 1) {
                return { valid: false, message: `Invalid input. Expected ${R + 1} lines (R C + rows), got ${matrixLines.length}.` };
            }
            
            for (let i = 1; i <= R; i++) {
                const row = matrixLines[i].split(' ').filter(x => x !== '');
                if (row.length !== C) {
                    return { valid: false, message: `Invalid row at line ${i+1}. Expected ${C} elements, got ${row.length}.` };
                }
                for (let j = 0; j < C; j++) {
                    if (isNaN(parseInt(row[j]))) {
                        return { valid: false, message: `Invalid element at row ${i}, column ${j+1}. Please provide integers only.` };
                    }
                }
            }
            break;
            
        case "two-strings":
            const strings = input.split(' ');
            if (strings.length < 2) {
                return { valid: false, message: "Invalid input. Please provide two strings separated by space." };
            }
            break;
    }
    
    return { valid: true, message: "Input is valid." };
}

// Route to the appropriate question processor
function processQuestion(questionId, input) {
    switch(questionId) {
        case 1: return processQuestion1(input);
        case 2: return processQuestion2(input);
        case 3: return processQuestion3(input);
        case 4: return processQuestion4(input);
        case 5: return processQuestion5(input);
        case 6: return processQuestion6(input);
        case 7: return processQuestion7(input);
        case 8: return processQuestion8(input);
        case 9: return processQuestion9(input);
        case 10: return processQuestion10(input);
        default: return "Question processor not found";
    }
}
