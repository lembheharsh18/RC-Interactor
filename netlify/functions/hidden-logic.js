exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { questionId, input } = JSON.parse(event.body);
    
    if (!questionId || !input) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing questionId or input' }) };
    }

    let output;
    
    switch(questionId) {
      case '1':
        // Essence of a Number (Digital Root)
        const n1 = parseInt(input.trim());
        if (isNaN(n1)) {
          output = "ERROR: Please enter a valid integer";
        } else if (n1 < 0) {
          output = "ERROR: Number must be non-negative (0 <= N <= 1e9)";
        } else if (n1 > 1000000000) {
          output = "ERROR: Number too large (N <= 1,000,000,000)";
        } else {
          // Digital root calculation
          function digitalRoot(num) {
            if (num === 0) return 0;
            return 1 + (num - 1) % 9;
          }
          output = digitalRoot(n1).toString();
        }
        break;

      case '2':
        // Pattern: Product of all numbers multiplied by count
        const numbers2 = input.trim().split(/\s+/).map(Number);
        if (numbers2.some(isNaN)) {
          output = "ERROR: Invalid numbers";
        } else {
          output = numbers2.reduce((prod, num) => prod * num, 1) * numbers2.length;
        }
        break;

      case '3':
        // Pattern: Sum of even-indexed elements minus odd-indexed
        const numbers3 = input.trim().split(/\s+/).map(Number);
        if (numbers3.some(isNaN)) {
          output = "ERROR: Invalid numbers";
        } else {
          output = numbers3.reduce((result, num, i) => i % 2 === 0 ? result + num : result - num, 0);
        }
        break;

      case '4':
        // Pattern: Number of 1s in binary representation
        const n4 = parseInt(input.trim());
        if (isNaN(n4)) {
          output = "ERROR: Invalid number";
        } else {
          output = (n4.toString(2).match(/1/g) || []).length;
        }
        break;

      case '5':
        // Pattern: Sum of first n prime numbers
        const n5 = parseInt(input.trim());
        if (isNaN(n5) || n5 < 1) {
          output = "ERROR: Invalid number";
        } else {
          function isPrime(x) {
            if (x < 2) return false;
            for (let i = 2; i <= Math.sqrt(x); i++) {
              if (x % i === 0) return false;
            }
            return true;
          }
          let count = 0, num = 2, total = 0;
          while (count < n5) {
            if (isPrime(num)) {
              total += num;
              count++;
            }
            num++;
          }
          output = total;
        }
        break;

      case '6':
        if (input.includes(' ')) {
          output = "ERROR: No spaces allowed";
        } else {
          output = input.trim().split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
        }
        break;

      case '7':
        const numbers7 = input.trim().split(/\s+/).map(Number);
        if (numbers7.some(isNaN)) {
          output = "ERROR: Invalid numbers";
        } else if (numbers7.length < 2) {
          output = "ERROR: Need at least 2 numbers";
        } else {
          let total = 0;
          for (let i = 0; i < numbers7.length - 1; i++) {
            total += numbers7[i] * numbers7[i + 1];
          }
          output = total;
        }
        break;

      default:
        output = "ERROR: Unknown question";
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ output: output.toString() })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};