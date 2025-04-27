const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 4000;

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API endpoint for image processing
app.post('/process-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const operation = req.body.operation;
        const imagePath = req.file.path;

        if (operation === 'copy-move') {
            const result = await runPythonScript('copy_move_detection.py', imagePath);
            fs.unlinkSync(imagePath);
            return res.json(result);
        } else if (operation === 'slicing') {
            const result = await runPythonScript('splicing_detection.py', imagePath);
            fs.unlinkSync(imagePath);
            return res.json(result);
        } else {
            fs.unlinkSync(imagePath);
            return res.status(400).json({ error: 'Invalid operation specified' });
        }
    } catch (error) {
        console.error('Error processing image:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

// Generic function to run Python scripts
async function runPythonScript(scriptName, imagePath) {
    return new Promise((resolve, reject) => {
        console.log(`Running ${scriptName} for:`, imagePath);

        const pythonExecutable = 'C:\\Users\\Public\\anaconda3\\python.exe'; // Your python path
        const scriptPath = path.join(__dirname, scriptName);

        const pythonProcess = spawn(pythonExecutable, [scriptPath, imagePath]);

        let stdoutData = '';
        let stderrData = '';

        pythonProcess.stdout.on('data', (data) => {
            stdoutData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            stderrData += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Python error output:', stderrData);
                return reject(new Error(stderrData || 'Python script failed'));
            }
            try {
                const result = JSON.parse(stdoutData);
                if (result.error) {
                    reject(new Error(result.error));
                } else {
                    resolve(result);
                }
            } catch (parseError) {
                console.error('Error parsing Python output:', parseError);
                console.log('Raw output:', stdoutData);
                reject(new Error('Invalid response from processing script'));
            }
        });
    });
}

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});