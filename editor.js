// editor.js

// Global variables potentially needed
let pyodide;
let codeEditor;

// Get references to DOM elements
// This is safe because defer ensures the script runs after DOM parsing
const outputElement = document.getElementById('output');
const runButton = document.getElementById('run');
const codeTextArea = document.getElementById('code');
document.getElementById('code-container');

// Function to append message and scroll output
function addToOutput(message) {
    outputElement.textContent += message;
    outputElement.scrollTop = outputElement.scrollHeight; // Auto-scroll
}

// Function to replace the previous message and display a new one
function displayNewMessage(newMessage) {
    outputElement.textContent = newMessage;
    outputElement.scrollTop = outputElement.scrollHeight; // Auto-scroll to the bottom in case the new message is long
}

async function main() {
    displayNewMessage(`Loading... Please wait...`);
    try {
        // Pyodide is loaded via its deferred script tag now,
        // but the `loadPyodide` function becomes globally available.
        // We still need to call it to initialize the instance.
        pyodide = await loadPyodide();

        displayNewMessage(`Pyodide ${pyodide.version}\n`);
        addToOutput(`Running Python ${pyodide.runPython("import sys; sys.version.split(' ')[0]")} 🐍\n\n`);
        // CodeMirror library is loaded via its deferred script tag.
        codeEditor = CodeMirror.fromTextArea(codeTextArea, {
            mode: 'python',
            theme: 'material-darker',
            lineNumbers: true,
            indentUnit: 2,
        });
        codeEditor.setSize("100%", "100%");

        // Redirect stdout and stderr
        pyodide.setStdout({
            batched: (str) => {
                addToOutput(str + "\n");
            }
        });
        pyodide.setStderr({
            batched: (str) => {
                addToOutput("Error: " + str + "\n");
            }
        });

        addToOutput("Edit the code above and press Run!\n");
        runButton.disabled = false; // Enable the run button

        // Add the click listener *after* setup is complete
        runButton.addEventListener('click', async () => {
            const code = codeEditor.getValue();
            outputElement.textContent = ''; // Clear previous output
            runButton.disabled = true; // Disable button during execution
            // addToOutput("Running Python code...\n");
            try {
                await pyodide.runPythonAsync(code);
                // addToOutput("\nExecution finished.\n");
            } catch (err) {
                addToOutput("Execution Error: " + err + "\n");
            } finally {
                runButton.disabled = false; // Re-enable button
            }
        });

    } catch (err) {
        addToOutput("Error loading Pyodide: " + err + "\n");
        console.error("Error loading Pyodide:", err);
        // Keep button disabled if loading fails
    }
}

// Since this script is deferred, the DOM is ready,
// and other deferred scripts (libs) have executed.
// We can call main directly.
main();
