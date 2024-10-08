---
date created: "Sunday, July 7th 2024, 1:28:18 am"
date modified: "Thursday, July 11th 2024, 9:19:21 pm"
layout: note
title: Flowbots
toc: true
---



```ascii
                      +-------------------+
                      |                     |
                      |  Input Processing  |
                      |                     |
                      +-------------------+
                               |
                               v
             +----------------------------------------+
             |                                        |
             |   +-------------+     +-------------+  |
             |   | Text        |     | Data        |  |
             |   | Processor   |     | Cleaning    |  |
             |   +-------------+     +-------------+  |
             |          |                  |          |
             |          v                  v          |
             |   +------------------------------------+
             |   |          Topic Modeling            |
             |   +------------------------------------+
             |                     |
             |            +--------+--------+
             |            |                 |
     +----------------+   |   +-----------------+
     |                |   |   |                 |
     | ResearcherTask |<--+-->|    WriterTask   |
     |                |   |   |                 |
     +----------------+   |   +-----------------+
             |            |                 |
             |            v                 |
             |   +------------------------------------+
             |   |          FinalizeTask              |
             |   +------------------------------------+
             |                     |
             |                     v
             |            +-----------------+
             |            |      Redis      |
             |            |     Storage     |
             |            +-----------------+
             |                     |
             |                     v
             |   +------------------------------------+
             |   |         Output Generation          |
             |   +------------------------------------+
             |            |         |         |
             |            v         v         v
             |   +----------+ +----------+ +----------+
             |   |  JSONL   | |   JSON   | | Console  |
             |   |   File   | |   File   | | Output   |
             |   +----------+ +----------+ +----------+
             |
             +----------------------------------------+
                               |
                               v
                      +-------------------+
                      |                   |
                      |  Result Display   |
                      |    (UI Boxes)     |
                      |                   |
                      +-------------------+

    Legend:
    -------
    -->  : Data flow
    +--+ : Component/Process
    |  | : Sub-component

    Notes:
    - Input processing includes Text Processor and Data Cleaning
    - Topic Modeling feeds into both ResearcherTask and WriterTask
    - FinalizeTask aggregates results and interacts with Redis
    - Output is generated in multiple formats
    - UI Boxes are used for result display throughout the process
```

------------------------------------------------------------------------

``` ascii
    _______________________________________________________________________________________________
   |                                                                                                |
   |                                   WorkflowOrchestrator                                         |
   |                                                                                                |
   |   ___________________________    ______________________________    __________________________  |
   |  |                           |  |                              |  |                          | |
   |  |    Input Processing    *1 |  |      Task Execution       *2 |  |    Output Generation  *3 | |
   |  |___________________________|  |______________________________|  |__________________________| |
   |     |                                 |                               |                        |
   |     |    ____________________         |    ______________________     |   ___________________  |
   |     |   |                    |        |   |                      |    |  |                   | |
   |     |   | TextProcessor   *4 |        |   | ResearcherTask    *6 |    |  | JSONL File     *9 | |
   |     |   |____________________|        |   |______________________|    |  |___________________| |
   |     |             |                   |              |                |                        |
   |     |    ____________________         |    ______________________     |   ___________________  |
   |     |   |                    |        |   |                      |    |  |                   | |
   |     |   | DataCleaning    *5 |        |   | WriterTask        *7 |    |  | JSON File     *10 | |
   |     |   |____________________|        |   |______________________|    |  |___________________| |
   |     |             |                   |              |                |                        |
   |     |             |                   |    ______________________     |   ___________________  |
   |     |             |                   |   |                      |    |  |                   | |
   |     |             |                   |   | FinalizeTask      *8 |    |  | Console Output*11 | |
   |     |             |                   |   |______________________|    |  |___________________| |
   |     |             |                   |              |                |            |           |
   |     |             |                   |              |                |            |           |
   |   __|_____________|___________________|______________|________________|____________|___        |
   |  |                                                                                    |        |
   |  |                                  Redis Storage                                  *12|        |
   |  |____________________________________________________________________________________|        |
   |                                           |                                                    |
   |    _______________________________________|_______________________________                     |
   |   |                                                                       |                    |
   |   |                              Result Display (UI Boxes)             *13|                    |
   |   |_______________________________________________________________________|                    |
   |                                                                                                |
   |________________________________________________________________________________________________|

   Annotations:
   ------------
   *1  Input Processing: Handles initial data input and preparation
   *2  Task Execution: Core workflow tasks are performed here
   *3  Output Generation: Produces various output formats
   *4  TextProcessor: Processes raw text input
   *5  DataCleaning: Cleans and normalizes input data
   *6  ResearcherTask: Performs research based on processed input
   *7  WriterTask: Generates written content based on research
   *8  FinalizeTask: Aggregates and finalizes task results
   *9  JSONL File: Outputs data in JSONL format
   *10 JSON File: Outputs data in JSON format
   *11 Console Output: Displays results in console
   *12 Redis Storage: Central data storage and retrieval system
   *13 Result Display: Uses UI Boxes to present results throughout the process

   Notes:
   ------
   - Arrows indicate data flow between components
   - Dashed lines represent optional or conditional flows
   - Components are nested to show hierarchical relationships
   - Redis Storage interacts with multiple components throughout the workflow
```
