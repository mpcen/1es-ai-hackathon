## Introduction

Hey everyone, Manny from the GitHub in Microsoft team!

Last week, I was also heads-down during the hackathon but on an "unofficial" project.

While I don't have a name for it, a few of the names generated by ChatGPT were:

-   SPDXinator
-   AI-License Ninja
-   LicenseSlayer 3000

So clearly, my project was around licenses, specifically open-source licenses. I was able to train an AI model to predict SPDX-formatted licenses from open-source license texts. Basically - provide some text, and the model will output the SPDX license ID associated with that text, with extremely high accuracy.

## Problem Statement

Today, Microsoft relies on a open-source tool called ClearlyDefined to identify licenses. ClearlyDefined is a community-led initiative to help clearly define the open source landscape around licenses. It's a great tool, but it's far from perfect. It's great because it houses the largest and most accurate dataset for open-source licenses on the internet. But it's not perfect because the service is expensive, brittle, and arugably miserable to maintain as a developer. Because of this, I created SPDXinator.

## Project Goals and Objectives

The objectives were pretty clear from the start:

-   I wanted to build an AI model that's super accurate at predicting licenses
-   I wanted to leverage the hottest, new open-source framework for building it
-   I wanted to use as little training data as possible
-   I wanted the model to be as small as possible. Small enough to run on free-tier Azure App Service

Sounds a bit optimistic for a solo-hackathon project, right?
Well, I'm happy to say that I was able to accomplish all of these goals thanks to HuggingFace Transformers.

## HuggingFace

I won't go too deep into HuggingFace but basically, it's an open-source framework and community that focuses on AI/ML. It provides easy-to-use API's and a wide-range of pre-trained models such as BERT, GPT, LLAMA, and more. It's built on top of PyTorch and it's the hottest framework for building AI models today - a whopping 109k stars on GitHub. You can sort of think of the community aspect of it as a GitHub for AI/ML models. It's also worth mentioning that Microsoft has a HGE presence is here. I encourage you to check it out - https://huggingface.co/.

## The Juice

Lets dive into the juicy stuff.

-   I'll start by showing you snippets of the dataset I used to train the model.
    -   NPM components
    -   ClearlyDefined, 36M components w/ licenses
    -   134 unique licenses
    -   Scripts to evaluate and clean the data - super iterative.
-   Then I'll show you how I trained the model.
-   Finally, I'll show you a head-to-head comparison between SPDXinator versus ChatGPT-3.5

**_I do want to emphasize that I am not an AI nor a Python expert - I learned both during this hackathon. If you see or hear anything weird,
feel free to let me know during Q&A._**

## Dataset

To keep things simple for the sake of the hackathon, I wanted to focus on a small subset of the license landscape - specifically licenses obtained from NPM components. I chose NPM because it's the most complete component dataset ClearlyDefined has at over 17M NPM components

Those 17M components gave me 134 different unique licenses. I then wrote a few scripts to extract both the licence and license text from various unique components. I ended up with a raw dataset of about 11k components.

Let's take a peek at the raw data:

```
A PERFECT SAMPLE:

  {
    "license": "MIT",
    "text": "THE MIT LICENSE Copyright <YEAR> <COPYRIGHT HOLDER> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
  },
```

```
A NOT SO PERFECT EXAMPLE:

{
    "license": "MIT",
    "text": "Skip to content Open Source Initiative [https://i0.wp.com/opensource.org/wp-content/uploads/2023/03/cropped-OSI-horizontal-large.png?fit=640%2C229&ssl=1]https://opensource.org * About [https://opensource.org/about/] * Programs [https://opensource.org/programs/] * Licenses [https://opensource.org/licenses/] * Open Source Definition [https://opensource.org/osd/] * News [https://blog.opensource.org] * Join [https://members.opensource.org/join/] * About [https://opensource.org/about/] * Programs [https://opensource.org/programs/] * Licenses [https://opensource.org/licenses/] * Open Source Definition [https://opensource.org/osd/] * News [https://blog.opensource.org] * Join [https://members.opensource.org/join/] Open Main Menu SEARCH OUR SITE Search Search for: * Popular / Strong Community [https://opensource.org/licenses/?categories=popular-strong-community] THE MIT LICENSE SPDX short identifier: MIT Open Spurce Initiative Approved License [/wp-content/themes/osi/assets/img/osi-badge-light.svg] License Copyright: Unknown. License License: Unknown. License Contact: Unknown. -------------------------------------------------------------------------------- Begin license text. -------------------------------------------------------------------------------- Copyright <YEAR> <COPYRIGHT HOLDER> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. -------------------------------------------------------------------------------- End license text. -------------------------------------------------------------------------------- Join Us [https://opensource.org/join/] * Mastodon [https://social.opensource.org/@osi] * Twitter [https://twitter.com/OpenSourceOrg] * LinkedIn [https://www.linkedin.com/company/open-source-initiative-osi-] ABOUT * About [https://opensource.org/about/] * Volunteers & Staff [https://opensource.org/volunteersandstaff/] * Associations [https://opensource.org/associations/] * Affiliates [https://opensource.org/affiliates/] * History [https://opensource.org/history/] * Privacy policy [https://opensource.org/privacy/] LICENSES * Open Source Definition [https://opensource.org/osd/] * Licenses [https://opensource.org/licenses/] * License Review Process [https://opensource.org/licenses/review-process/] BOARD * Board of Directors [https://opensource.org/about/board-of-directors/] * Minutes [https://opensource.org/minutes/] * Elections [https://opensource.org/about/board-of-directors/elections/] * Organization & Operations [https://opensource.org/organization/] * Articles of Incorporation [https://opensource.org/articles-of-incorporation/] * Bylaws [https://opensource.org/bylaws/] * Conflict of Interest Policy [https://opensource.org/conflict_of_interest_policy/] * Board member agreement [https://opensource.org/board/board-member-agreement/] TRADEMARK AND LOGO * OSI Trademark Guidelines [https://opensource.org/trademark-guidelines/] * OSI Logo Files [https://opensource.org/osi-logo-files/] * Logo Usage Guidelines [https://opensource.org/logo-usage-guidelines/] COMMUNITY * Resources [https://opensource.org/resources/] * Become an Individual Member [https://opensource.org/members/] * Events [https://opensource.org/category/events/] * Become an OSI Affiliate [https://opensource.org/affiliates/about/] * OSI Affiliate Organizations [https://opensource.org/affiliates/] Proudly powered by WordPress. [https://wordpress.com/wp/?partner_domain=opensource.org&utm_source=Automattic&utm_medium=colophon&utm_campaign=Concierge%20Referral&utm_term=opensource.org] Hosted by Pressable. [https://pressable.com/?utm_source=Automattic&utm_medium=rpc&utm_campaign=Concierge%20Referral&utm_term=concierge]"
}
```

As you can see, the not so perfect example has a lot of unnecessary text (before license text, and after license text), special characters, and links. This was pretty common among all licenses so some decent data processing definitely had to be done. Without spending too much time on this, I wrote a normalizer that extracted special characters, extra line breaks, and weird headers & footers, it definitely helped but there was quite a bit of trial-and-error involved during training.

## Training

For training, I leveraged a pre-trained model posted on HuggingFace named Funnel that specializes in performing sentiment analysis of text. In short, this model was previously trained using IMDB Review data, to classify if a review was positive or negative. I used this model as a starting point and fine-tuned it to classify which license the text belonged to. So rather than 2 labels of positive and negative, there were 134 labeles, each being a license. It's worth noting 3 of the hyperparameters I used for the training:

-   Epochs: 9
-   Weight Decay: 0.1
-   Max Sequence Length: 1024

After about an hour and 20 minutes of training, I finally got results and was immediately impressed. First with how decent the predictions were but more imporantly, how many samples of bad data there were in ClearlyDefined. I had to go through several training iterations to find and clean that bad data. I was able to conclude with a 86% accuracy on the training and validation sets which I was happy with so I decided to move on...

## Comparison

I wanted to compare SPDXinator to ChatGPT since it already does a decent job at detecting licenses from text. Keep in mind, ChatGPT is massive while my model is only 400mb's and was only trained on 11k components.

For this comparison, I took the top 15 most trending repos on github and fed their license texts to both models. None of these components were used in the training or validation sets so it was a decent test of how well the model performed.

As you can see, the results are compariable and at times can be better than ChatGPT.

## Closing Thoughts

The main thing I want to close with is, how efficient and cost-effective open source solutions like this can be. You don't always need the biggest and most powerful models to achieve the results you want. What you need is data, not a lot of it, but just enough to cover most of your specific use cases because you can always fine-tine the model at will.

I haven't been this excited about tech since 2016 when I first discovered React. This will huge and it's definitely a skillset we should all strive to master.

Thanks for listening and special thanks to the 1ES Managers that made this happen!

## Q & A
