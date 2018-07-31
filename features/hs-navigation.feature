Feature: HealthScience.Network Navigation plugin

  A the menu list to navigate different visualisation from the network.

  Background: The ResolutionScience Application is Open
  Given I have opened the ResolutionScience application

  Scenario: Display the healthscience navigation
    Given The healthscience navigation menu is present
    When  The heart menu link is clicked
    Then  A chart component will be displayed

    Scenario: Display the healthscience navigation
      Given The healthscience navigation menu is present
      When  The simulation menu link is clicked
      Then  A heart simulation component will be displayed
