# This is a _very simple_ example of a web service that recognizes faces in uploaded images.
# Upload an image file and it will check if the image contains a picture of Barack Obama.
# The result is returned as json. For example:
#
# $ curl -XPOST -F "file=@obama2.jpg" http://127.0.0.1:5001
#
# Returns:
#
# {
#  "face_found_in_image": true,
#  "is_picture_of_obama": true
# }
#
# This example is based on the Flask file upload example: http://flask.pocoo.org/docs/0.12/patterns/fileuploads/

# NOTE: This example requires flask to be installed! You can install it with pip:
# $ pip3 install flask

import face_recognition
from flask import Flask, jsonify, request, redirect

# You can change this to any folder on your system
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def upload_image():
    # Check if a valid image file was uploaded
    if request.method == 'POST':
        if 'face' not in request.form or 'faces' not in request.form:
            return redirect(request.url)

            # The image file seems valid! Detect faces and return the result.
        return detect_faces_in_image(request.form["face"], request.form["faces"])

    # If no valid image file was uploaded, show the file upload form:
    return '''
    <!doctype html>
    <title>Is this a picture of Obama?</title>
    <form method="POST">
      <input type="text" name="face" placeholder="Anh nguoi can nhan dien">
      <input type="text" name="faces" placeholder="Danh sach anh can nhan dien">
      <input type="submit" value="Upload">
    </form>
    '''


def detect_faces_in_image(file_stream,known_faces):
    # Pre-calculated face encoding of Obama generated with face_recognition.face_encodings(img)
    known_face = eval(known_faces)
    # Load the uploaded image file
    img = face_recognition.load_image_file(file_stream)
    # Get face encodings for any faces in the uploaded image
    unknown_face_encodings = face_recognition.face_encodings(img)

    face_found = False
    file_match = False
    who_match = ""
    position_face = face_recognition.face_locations(img)[0]
    if len(unknown_face_encodings) > 0:
        face_found = True
        # See if the first face in the uploaded image matches the known face of Obama
        for face in known_face:
            img_face = face_recognition.load_image_file(face["path"])
            known_face_encoding = face_recognition.face_encodings(img_face)
            match_results = face_recognition.compare_faces([known_face_encoding[0]], unknown_face_encodings[0])
            if match_results[0]:
                file_match = True
                who_match = face["id"]
                break

    # Return the result as json
    result = {
        "face_found_in_image": face_found,
        "is_picture_match": file_match,
        "who_match": who_match,
        "position_face": position_face
    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
