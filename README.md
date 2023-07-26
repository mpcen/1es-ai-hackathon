# mpcen/legal-001 Open Source Legal License AI Model

Trained on top of a Funnel-based model: https://huggingface.co/Sreevishnu/funnel-transformer-small-imdb

## Description

This model was trained on a dataset of approximately 11,000 components with open source licenses obtained from https://ClearlyDefined.io. The model is able to predict the SPDX-formatted license of a given license text input. The results are comparable to ChatGPT-3.5 while only being ~400mb. The model is currently hosted on the HuggingFace Hub: https://huggingface.co/mpcen/legal-001

---

### NOTES:

-   Most of this code is hackathon-quality as it was built during a hackathon... you dig!??!?\*\*
-   I had no experience w/ Python before this hackathon so dont mind the garbanzo patterns.

---

### Pre-reqs and things to know

-   A virtual python3 environment is recommended.
-   A GPU that supports CUDA is required to train the model. Training using an NVIDIA 2080TI took about 1.5hrs.
-   Azure Blob URL for `final-data.json`, the dataset used for training can be found at: https://mpcenlegal001.blob.core.windows.net/mpcen-legal-001/final-data.json. You probably need to request READ permissions. This needs to be placed in the `./legal-001/training/` directory. It might be outdated though so confirm with me before using it.

---

### Scritps & Projects

-   `license-sourcer` - Used to source licenses from ClearlyDefined.io's database and build the raw dataset used for training. This project includes several scripts that help clean, normalize, and balance the dataset.

-   `legal-001` - A set of python scripts used to perform data-analysis, train the model, and export the model for use in the API.

    -   `data-scripts`
        -   `data-adder` - Used to add more data into `final-data.json`
        -   `data-cleaner` - Used to explore and clean bad data. Updates `final-data.json`
    -   `inference` - Used to test the model and generate predictions. This script compares legal-001's accuracy against ChatGPT-3.5 using license data obtained from the top 20 trending repo's on GitHub. **_The model was not trained using this data._**
    -   `training` - Used to train the model. This script uses `final-data.json` to train the model. The model is then exported to `./legal-001/saved_model`. This model eventually gets pushed to the HuggingFace Hub.

---

### Training Results

| Epoch | Training Loss | Validation Loss | Accuracy |
| ----- | ------------- | --------------- | -------- |
| 1     | 2.349000      | 1.206852        | 0.648179 |
| 2     | 0.797600      | 0.638574        | 0.766940 |
| 3     | 0.501700      | 0.453188        | 0.824226 |
| 4     | 0.461900      | 0.396958        | 0.838798 |
| 5     | 0.403900      | 0.369298        | 0.838980 |
| 6     | 0.362200      | 0.360716        | 0.848816 |
| 7     | 0.350700      | 0.339838        | 0.851275 |
| 8     | 0.351700      | 0.328191        | 0.855191 |
| 9     | 0.325500      | 0.321899        | 0.858106 |

---

### Inference Comparison Results

```
-------------------
Actual license: Apache-2.0
mpcen/legal-001 license: Apache-2.0
ChatGPT-3.5 license: Apache-2.0
-------------------

-------------------
Actual license: MIT
mpcen/legal-001 license: MIT
ChatGPT-3.5 license: MIT
-------------------

-------------------
Actual license: AGPL-3.0
mpcen/legal-001 license: AGPL-3.0
ChatGPT-3.5 license: AGPL-3.0-or-later
-------------------

-------------------
Actual license: GPL-2.0
mpcen/legal-001 license: GPL-2.0
ChatGPT-3.5 license: GPL-2.0-only
-------------------

-------------------
Actual license: OFL-1.1
mpcen/legal-001 license: OFL-1.1
ChatGPT-3.5 license: OFL-1.1
-------------------

-------------------
Actual license: MPL-2.0
mpcen/legal-001 license: MPL-2.0
ChatGPT-3.5 license: MPL-2.0
-------------------

-------------------
Actual license: BSD-3-Clause
mpcen/legal-001 license: BSD-3-Clause
ChatGPT-3.5 license: BSD-3-Clause
-------------------

-------------------
Actual license: GPL-3.0
mpcen/legal-001 license: GPL-3.0-only
ChatGPT-3.5 license: GPL-3.0-only
-------------------

-------------------
Actual license: BSD-2-Clause
mpcen/legal-001 license: BSD-2-Clause
ChatGPT-3.5 license: BSD-2-Clause
-------------------

-------------------
Actual license: CC-BY-4.0
mpcen/legal-001 license: CC-BY-4.0
ChatGPT-3.5 license: CC-BY-4.0
-------------------
```

---

### Google Colab Notebooks

-   `Trainer` - https://colab.research.google.com/drive/1H9A2HuYyUHQn3djKaw0yOyS_089qp8kv?usp=sharing
-   `Inference comparison` - https://colab.research.google.com/drive/1xP6uBqHiIotVFLyZPZn62nUSGEIvpTYD?usp=sharing
