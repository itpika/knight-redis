const { TouchBar } = require('electron');
const { TouchBarButton, TouchBarLabel } = TouchBar;
const b = new TouchBarButton({
  icon: 'public/image/touchbar/+.png'
});

module.exports = new TouchBar({
  items: [b],
});