# Business Plus Unit 6: Out and about

Website: https://ij-teacher.github.io/business-plus-u6/

Bilingual teaching website based on the supplied six-slide PowerPoint. Includes comparative grammar, travel speaking, Track 32 audio, Richmond Hotel reading, twelve supplementary practice questions, explanations and printable QR code.

## Files
- index.html, style.css, app.js: website
- data/lesson.json: editable lesson, reading texts and vocabulary
- data/questions.json: editable practice bank; answer is a zero-based option index
- materials/business-plus-u6.pptx: unchanged original presentation
- materials/track-32.mp3: supplied course audio
- materials/image*: images extracted from the original presentation
- qr-code.svg and qr.html: website QR code and print page

## Storage
Website source, course data and teaching materials are stored in this GitHub repository. Student answers stay in browser localStorage and can be downloaded as JSON; this static website does not upload student records to GitHub. No authentication tokens belong in website files.

## Teaching notes
Source pages are 46, 47, 48 and 51. Some text is embedded in images. The source deck does not provide the complete country-comparison data table, so missing answers are not invented. Supplementary grammar explanations, activity steps and quiz questions are identified as teaching additions. Country statistics in original exercises should be interpreted as textbook data, not current statistics. Original materials retain their authors’ rights; no open content license is granted.

## Maintenance
Edit files on main. GitHub Pages serves the repository root and republishes after changes. Preview using a local HTTP server, because lesson JSON loads through fetch.
