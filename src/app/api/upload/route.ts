import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOC, DOCX, and images are allowed.' },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create a unique filename to prevent overwriting
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // Sanitize filename by replacing spaces with dashes
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '-')}`;
    
    // Define the upload directory inside public
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    
    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });
    
    // Write the file to disk
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    
    // Generate the public URL path
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
      },
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
