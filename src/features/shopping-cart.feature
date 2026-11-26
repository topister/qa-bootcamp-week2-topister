Feature: Manage items in the shopping cart
As a Toolshop shopper
I want to add and remove products in my shopping cart
So that I can review accurate item prices and totals before checkout 

Background:
Given the shopper is browsing the Toolshop catalog 

Scenario: Add multiple products to the cart and verify the total
When the shopper adds "Combination Pliers" priced at "$14.15" to the cart
And the shopper adds "Bolt Cutters" priced at "$48.41" to the cart
And the shopper views the shopping cart
Then both "Combination Pliers" and "Bolt Cutters" appear in the cart
And the cart total reflects the combined price of "$62.56" 

Scenario: Remove an item from a multi-item cart and verify the updated total
Given the shopper has "Combination Pliers" ($14.15) and "Bolt Cutters" ($48.41) in the cart
When the shopper removes "Combination Pliers" from the cart
Then only "Bolt Cutters" remains in the cart
And the cart total updates to "$48.41"