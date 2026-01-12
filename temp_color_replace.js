// Temporary script to replace all #e23845 with #02757A
const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Replace all occurrences of #e23845 with #02757A (case insensitive)
    content = content.replace(/#e23845/gi, '#02757A');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// List of files that contain #e23845
const filesToUpdate = [
  'app/home/Dining.jsx',
  'app/home/Events.jsx', 
  'app/home/TakeAway.jsx',
  'app/home/Tiffin.jsx',
  'app/screens/Collections.jsx',
  'app/screens/FirmDetailsDining.jsx',
  'app/screens/FirmDetailsTakeAway.jsx',
  'app/screens/OnMindScreens.jsx',
  'app/screens/ReviewDetails.jsx',
  'app/screens/TakewayCollection.jsx',
  'app/screens/tiffinonmind.jsx',
  'components/DaningCard.jsx',
  'components/Filterbox.jsx',
  'components/FilterModal.jsx',
  'components/FirmCard.jsx',
  'components/HomeHeader.jsx',
  'components/TakewayCollection.jsx',
  'components/TiffinCollection.jsx',
  'styles/bookingsummary.jsx',
  'styles/CollectionsStyles.jsx',
  'styles/DiningStyles.jsx',
  'styles/EventDetailsStyles.jsx',
  'styles/filterstyle.jsx',
  'styles/FirmBookingStyles.jsx',
  'styles/FirmCardStyle.jsx',
  'styles/FirmDetailsDiningStyles.jsx',
  'styles/FirmDetailsTakeAwayStyles.jsx',
  'styles/InputBox.js',
  'styles/LoginScreenStyles.jsx',
  'styles/OtpVerificationStyles.jsx',
  'styles/RegisterScreenStyles.jsx',
  'styles/ReviewCardStyles.jsx',
  'styles/ReviewDetailsStyles.jsx',
  'styles/TakeAwayStyles.jsx',
  'styles/TakewayCollection.jsx',
  'styles/tiffinDetailsStyle.jsx',
  'styles/tiffinServiceDetailsstyle.jsx',
  'styles/tiffinstyle.jsx'
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    replaceInFile(fullPath);
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});

console.log('Color replacement completed!');