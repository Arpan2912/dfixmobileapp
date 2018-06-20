# dfixmobileapp
npm install

# Instruction
save Image Task
SaveToMediaStore Method add following code
#####
ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
image.compress(Bitmap.CompressFormat.JPEG, 70, byteArrayOutputStream);
byte[] byteArray = byteArrayOutputStream .toByteArray();
String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
#####
