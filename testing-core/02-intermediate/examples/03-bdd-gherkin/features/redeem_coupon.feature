# Feature: Redeem coupon at checkout
#   เป็นสเปกที่ธุรกิจอ่านได้ — automation map จากประโยคเหล่านี้

  Scenario: Successfully redeem a valid coupon
    Given a coupon "SAVE10" with 10 percent off and 1 remaining use
    And an order subtotal of 200
    When the customer redeems coupon "SAVE10"
    Then the discounted total should be 180
    And the coupon remaining uses should be 0

  Scenario: Reject exhausted coupon
    Given a coupon "SAVE10" with 10 percent off and 0 remaining uses
    And an order subtotal of 200
    When the customer redeems coupon "SAVE10"
    Then the redeem should fail with reason "EXHAUSTED"
