Feature: Concert seat reservation

  Scenario: Confirm reservation after successful payment
    Given an event "concert" with available seat "A1"
    And a customer "alice"
    When the customer reserves seat "A1" with successful payment of 1500
    Then the reservation status should be "CONFIRMED"
    And seat "A1" should be held by "alice"

  Scenario: Release seat when payment fails
    Given an event "concert" with available seat "A1"
    And a customer "alice"
    When the customer reserves seat "A1" with failed payment of 1500
    Then the reservation status should be "FAILED"
    And seat "A1" should be available
