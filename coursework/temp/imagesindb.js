var image = multer({ inMemory: true,
                     storage: multer.memoryStorage({}) });

//in function
var image = req.file.buffer.toString('base64');

//in html
src="data:image/jpg;base64, <%= arr[i].image %>"

//in drug.js 
image: { type: Buffer  }
