exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    const { questionId, input } = JSON.parse(event.body);
    
    // Input validation
    if (!questionId || !input) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing questionId or input' })
      };
    }

    if (input.length > 1000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Input too long (max 1000 characters)' })
      };
    }

    let output;
    
    // HIDDEN LOGIC - Users cannot see this!
    switch(questionId) {
      case '1':
        // Pattern: Sum of squares for multiple numbers, triangular number for single
        const parts1 = input.trim().split(/\s+/).map(Number);
        if (parts1.some(isNaN)) {
          output = "ERROR: Invalid input format. Please enter numbers only.";
        } else if (parts1.length === 1) {
          output = parts1[0] * (parts1[0] + 1) / 2; // Triangular number
        } else {
          output = parts1.reduce((sum, x) => sum + x * x, 0);
        }
        break;

      case '2':
        // Pattern: Product of all numbers multiplied by count
        const numbers2 = input.trim().split(/\s+/).map(Number);
        if (numbers2.some(isNaN)) {
          output = "ERROR: Invalid input format. Please enter numbers only.";
        } else {
          const product2 = numbers2.reduce((prod, num) => prod * num, 1);
          output = product2 * numbers2.length;
        }
        break;

      case '3':
        // Pattern: Sum of even-indexed elements minus odd-indexed
        const numbers3 = input.trim().split(/\s+/).map(Number);
        if (numbers3.some(isNaN)) {
          output = "ERROR: Invalid input format. Please enter numbers only.";
        } else {
          output = numbers3.reduce((result, num, i) => {
            return i % 2 === 0 ? result + num : result - num;
          }, 0);
        }
        break;

      case '4':
        // Pattern: Number of 1s in binary representation
        const n4 = parseInt(input.trim());
        if (isNaN(n4)) {
          output = "ERROR: Invalid input format. Please enter a single number.";
        } else {
          output = (n4.toString(2).match(/1/g) || []).length;
        }
        break;

      case '5':
        // Pattern: Sum of first n prime numbers
        const n5 = parseInt(input.trim());
        if (isNaN(n5)) {
          output = "ERROR: Invalid input format. Please enter a single number.";
        } else if (n5 < 1) {
          output = "ERROR: Please enter a positive integer.";
        } else {
          function isPrime(x) {
            if (x < 2) return false;
            for (let i = 2; i <= Math.sqrt(x); i++) {
              if (x % i === 0) return false;
            }
            return true;
          }
          
          let count5 = 0;
          let num5 = 2;
          let total5 = 0;
          while (count5 < n5) {
            if (isPrime(num5)) {
              total5 += num5;
              count5++;
            }
            num5++;
          }
          output = total5;
        }
        break;

      case '6':
        // Pattern: ASCII sum of characters
        if (input.trim().length === 0) {
          output = "ERROR: Input cannot be empty";
        } else if (input.includes(' ')) {
          output = "ERROR: This question does not allow spaces in the input string";
        } else {
          output = input.trim().split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
        }
        break;

      case '7':
        // Pattern: Sum of products of consecutive pairs
        const numbers7 = input.trim().split(/\s+/).map(Number);
        if (numbers7.some(isNaN)) {
          output = "ERROR: Invalid input format. Please enter numbers only.";
        } else if (numbers7.length < 2) {
          output = "ERROR: This question requires at least 2 numbers";
        } else {
          let total7 = 0;
          for (let i = 0; i < numbers7.length - 1; i++) {
            total7 += numbers7[i] * numbers7[i + 1];
          }
          output = total7;
        }
        break;

      default:
        output = "ERROR: Unknown question ID";
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        output: output.toString(),
        questionId: questionId
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Internal server error: ' + error.message })
    };
  }
};