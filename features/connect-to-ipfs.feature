Feature: Connect to an IPFS network

  Enable connectivty between RS and IPFS

  Background: The ResolutionScience Application is Open
  Given I have opened the ResolutionScience application

  Scenario: Retrive data file from IPFS
    Given The welcome navigation meun is present
    When  an IPFS button is clicked
    Then  File content is read
