# mpcen/legal-001 Open Source Legal License AI Model

Fine-tuned from the base model `https://huggingface.co/Sreevishnu/funnel-transformer-small-imdb`

### **NOTE: Most of this code is hackathon-quality**

---

### This repo includes 3 sub-repos that were used to build this model.

-   `license-sourcer` - Used to source licenses from ClearlyDefined.io's database and build the raw dataset used for training. This project includes several scripts that help clean, normalize, and balance the dataset.

-   `api` - A simple Node.js API that serves the model and provides a simple interface for making predictions.

    -   You must download the model from https://mpcenlegal001.blob.core.windows.net/mpcen-legal-001/models.zip and extract it to `api/models` for the API to work.
    -   `API Endpoints:`

        -   POST: https://mpcen-legal-001.azurewebsites.net/
        -   BODY: { "text": "This is some license text doing its best to meet SPDX standards" }

-   `ai-model` - A set of python scripts used to perform data-analysis, train the model, and export the model for use in the API.

    -   Azure Blob URL for `final-data.json`, the dataset used for training can be found at: `https://mpcenlegal001.blob.core.windows.net/mpcen-legal-001/final-data.json`. You probably need to request READ permissions.
