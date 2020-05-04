const FileManager = () => {
  // Create WP Media object
  let frame = wp.media({
    title: 'Select or Upload Media Of Your Choice',
    button: {
      text: 'Use Media File'
    },
    multiple: false  // Set to true to allow multiple files to be selected
  });
  // Create promise
  let action = new Promise((resolve, reject) => {
    // When an image is selected in the media frame...
    frame.on( 'select', function() {
      // Get media attachment details from the frame state
      let attachment = frame.state().get('selection').first().toJSON();
      resolve(attachment);
    });
  });
  // Finally, open the modal on click
  frame.open();
  // Return promise
  return action;
}

export default FileManager;