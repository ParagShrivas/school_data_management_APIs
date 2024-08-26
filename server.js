const express = require('express');
const bodyParser = require('body-parser');
const school_router = require('./routes/school_router');

const app = express();
app.use(bodyParser.json());

app.use('/api', school_router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
});
