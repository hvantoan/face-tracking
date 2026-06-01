#!/bin/bash
# Copy face detection model files from @vladmandic/human to public/models/
set -e
mkdir -p public/models
# Copy blazeface (face detector) model files
cp node_modules/@vladmandic/human/models/blazeface* public/models/ 2>/dev/null || true
# Copy face mesh model files (may be facemesh or faceLandmark68)
cp node_modules/@vladmandic/human/models/facemesh* public/models/ 2>/dev/null || true
cp node_modules/@vladmandic/human/models/face_landmark_68* public/models/ 2>/dev/null || true
cp node_modules/@vladmandic/human/models/faceLandmark68* public/models/ 2>/dev/null || true
# Also check subdirectories
if [ -d "node_modules/@vladmandic/human/models/blazeface" ]; then
  cp node_modules/@vladmandic/human/models/blazeface/* public/models/ 2>/dev/null || true
fi
echo "Model files copied to public/models/:"
ls -la public/models/