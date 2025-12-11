#!/bin/bash

BASE_URL="http://localhost:8000/events"

echo "🚀 Generating example events..."

echo "📧 Creating user registration events..."
for i in {1..10}; do
    curl -X POST "$BASE_URL/user-registered" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "user_'$i'",
            "timestamp": "2025-12-10T12:0'$((i % 6))':"'$((10 + i))'".000Z"
        }'
    echo
done

echo "🔐 Creating user login events..."
for i in {1..12}; do
    curl -X POST "$BASE_URL/user-login" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "user_'$((i % 5 + 1))'",
            "timestamp": "2025-12-10T13:0'$((i % 6))':"'$((20 + i))'".000Z"
        }'
    echo
done

echo "💳 Creating transaction events..."
amounts=("19.99" "49.99" "99.99" "199.99" "9.99" "29.99" "79.99" "149.99")
currencies=("USD" "EUR" "GBP" "USD" "USD" "EUR" "USD" "GBP")
for i in {1..8}; do
    curl -X POST "$BASE_URL/transaction" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "user_'$((i % 3 + 1))'",
            "transaction_id": "txn_'$i'",
            "amount": "'${amounts[$((i-1))]}'",
            "currency": "'${currencies[$((i-1))]}'",
            "timestamp": "2025-12-10T14:0'$((i % 6))':"'$((30 + i))'".000Z"
        }'
    echo
done

echo "🖱️ Creating element click events..."
elements=("buy_button" "add_to_cart" "search_button" "menu_icon" "logo" "footer_link" "contact_button" "help_button")
pages=("/product/123" "/catalog" "/search" "/" "/about" "/contact" "/help" null)
for i in {1..8}; do
    page_value=${pages[$((i-1))]}
    if [ "$page_value" = "null" ]; then
        page_json="null"
    else
        page_json="\"$page_value\""
    fi
    
    curl -X POST "$BASE_URL/element-click" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "user_'$((i % 4 + 1))'",
            "element_name": "'${elements[$((i-1))]}'",
            "page": '$page_json',
            "timestamp": "2025-12-10T15:0'$((i % 6))':"'$((40 + i))'".000Z"
        }'
    echo
done

echo "🔍 Creating search events..."
queries=("laptop" "phone" "tablet" "headphones" "mouse" "keyboard" "monitor" "speaker" "camera")
for i in {1..9}; do
    curl -X POST "$BASE_URL/search" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "user_'$((i % 3 + 1))'",
            "query": "'${queries[$((i-1))]}'",
            "timestamp": "2025-12-10T16:0'$((i % 6))':"'$((50 + i))'".000Z"
        }'
    echo
done

echo "👁️ Creating page view events..."
pages=("/catalog" "/product/123" "/product/456" "/cart" "/checkout" "/profile" "/orders" "/support")
for i in {1..8}; do
    curl -X POST "$BASE_URL/page-view" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "user_'$((i % 5 + 1))'",
            "page": "'${pages[$((i-1))]}'",
            "timestamp": "2025-12-10T17:0'$((i % 6))':"'$((60 + i))'".000Z"
        }'
    echo
done

echo "📝 Creating form submit events..."
forms=("contact_form" "feedback_form" "newsletter_form" "support_form" "registration_form" "checkout_form" "review_form" "survey_form")
for i in {1..8}; do
    curl -X POST "$BASE_URL/form-submit" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "user_'$((i % 4 + 1))'",
            "form_name": "'${forms[$((i-1))]}'",
            "timestamp": "2025-12-10T18:0'$((i % 6))':"'$((70 + i))'".000Z"
        }'
    echo
done

echo "🛒 Creating item added to cart events..."
items=("product_1" "product_2" "product_3" "product_4" "product_5" "product_6" "product_7" "product_8" "product_9" "product_10")
for i in {1..10}; do
    curl -X POST "$BASE_URL/item-added-to-cart" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "user_'$((i % 3 + 1))'",
            "item_id": "'${items[$((i-1))]}'",
            "timestamp": "2025-12-10T19:0'$((i % 6))':"'$((80 + i))'".000Z"
        }'
    echo
done

echo "🗑️ Creating item removed from cart events..."
for i in {1..8}; do
    curl -X POST "$BASE_URL/item-removed-from-cart" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "user_'$((i % 3 + 1))'",
            "item_id": "product_'$i'",
            "timestamp": "2025-12-10T20:0'$((i % 6))':"'$((90 + i))'".000Z"
        }'
    echo
done

echo "🔧 Creating filter applied events..."
filters=("price_range" "category" "brand" "rating" "size" "color" "availability" "discount")
filter_values=("100-500" "electronics" "apple" "4-5" "large" "red" "in_stock" "10-30")
filter_pages=("/catalog" "/search" "/category/electronics" "/catalog" "/search" "/category/clothing" "/catalog" "/search")
for i in {1..8}; do
    curl -X POST "$BASE_URL/filter-applied" \
        -H "Content-Type: application/json" \
        -d '{
            "user_id": "user_'$((i % 4 + 1))'",
            "filter_name": "'${filters[$((i-1))]}'",
            "filter_value": "'${filter_values[$((i-1))]}'",
            "page": "'${filter_pages[$((i-1))]}'",
            "timestamp": "2025-12-10T21:0'$((i % 6))':"'$((100 + i))'".000Z"
        }'
    echo
done

echo "✅ Event generation completed!"
echo "📊 Total events generated: 89"