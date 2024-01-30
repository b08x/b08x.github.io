---
---


Here is a typical process for generating stop words in NLP document processing:

1. Start with a base list of common stop words in the language of your documents. There are pre-made stop word lists available for many languages that you can use as a starting point.

2. Examine your corpus and identify frequently occurring terms that don't contain useful meaning or discriminate between documents. These are candidates to add to your stop word list.

3. Look for domain-specific stopwords that are common in your corpus but irrelevant to the analysis. These will depend on the topic of your documents.

4. Consider removing overly generic stopwords from the base list if they could contain meaningful information for your specific application. For example, you may want to keep "not" if you care about negation.

5. As you test your document processing pipelines, examine results for unnecessary stopwords that were missed. Add any new ones you find to your stop word list.

6. Periodically review your custom stop word list as your corpus evolves and add or remove words as needed.

7. Consider using a frequency-based threshold, such as removing terms that appear in more than 50% of documents.

8. Sometimes a graded stop word list ordered by frequency works better than a binary include/exclude list.

The goal is to iteratively develop a compact list of words that appear frequently but carry little meaningful information in your corpus. The optimal stop word list will depend on your data and end application.