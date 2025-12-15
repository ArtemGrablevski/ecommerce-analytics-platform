#!/bin/bash

BASE_URL="http://localhost:8000/events"

echo "🚀 Generating realistic events across multiple days and hours..."

# Function to generate random timestamp in the last 7 days
generate_random_timestamp() {
    local day_offset=$((RANDOM % 7))
    local hour=$((RANDOM % 24))
    local minute=$((RANDOM % 60))
    local second=$((RANDOM % 60))
    
    # Calculate date (last 7 days)
    local date=$(date -d "-${day_offset} days" +%Y-%m-%d)
    echo "${date}T$(printf "%02d:%02d:%02d" $hour $minute $second).000Z"
}

# Generate user registrations (spread across last week)
echo "📧 Creating diverse user registration events..."
users=("alice" "bob" "charlie" "diana" "eve" "frank" "grace" "henry" "iris" "jack" "kate" "leo" "mary" "nick" "olivia" "paul" "quinn" "rose" "sam" "tina")

for i in {1..20}; do
    timestamp=$(generate_random_timestamp)
    user_id="${users[$((i-1))]}_$(($i + 1000))"
    
    curl -s -X POST "$BASE_URL/user-registered" \
        -H "Content-Type: application/json" \
        -d "{
            \"user_id\": \"$user_id\",
            \"timestamp\": \"$timestamp\"
        }" > /dev/null
done

# Generate user logins (more frequent, spread across hours)
echo "🔐 Creating diverse user login events..."
for i in {1..40}; do
    timestamp=$(generate_random_timestamp)
    user_id="${users[$((RANDOM % 20))]}_$(($((RANDOM % 20)) + 1000))"
    
    curl -s -X POST "$BASE_URL/user-login" \
        -H "Content-Type: application/json" \
        -d "{
            \"user_id\": \"$user_id\",
            \"timestamp\": \"$timestamp\"
        }" > /dev/null
done

# Generate transactions with varied amounts and currencies
echo "💳 Creating diverse transaction events..."
amounts=("19.99" "49.99" "99.99" "199.99" "9.99" "29.99" "79.99" "149.99" "299.99" "399.99" "5.99" "15.99" "39.99" "89.99" "159.99")
currencies=("USD" "EUR" "GBP" "USD" "USD" "EUR" "USD" "GBP" "USD" "CAD" "USD" "EUR" "USD" "JPY" "USD")

for i in {1..25}; do
    timestamp=$(generate_random_timestamp)
    user_id="${users[$((RANDOM % 20))]}_$(($((RANDOM % 20)) + 1000))"
    amount_idx=$((RANDOM % 15))
    
    curl -s -X POST "$BASE_URL/transaction" \
        -H "Content-Type: application/json" \
        -d "{
            \"user_id\": \"$user_id\",
            \"transaction_id\": \"txn_$(date +%s)_$i\",
            \"amount\": \"${amounts[$amount_idx]}\",
            \"currency\": \"${currencies[$amount_idx]}\",
            \"timestamp\": \"$timestamp\"
        }" > /dev/null
done

# Generate page views with different pages
echo "👁️ Creating diverse page view events..."
pages=("/home" "/catalog" "/product/laptop-pro" "/product/phone-x" "/product/tablet-air" "/cart" "/checkout" "/profile" "/orders" "/support" "/about" "/contact" "/search" "/category/electronics" "/category/clothing" "/category/books" "/deals" "/new-arrivals")

for i in {1..60}; do
    timestamp=$(generate_random_timestamp)
    user_id="${users[$((RANDOM % 20))]}_$(($((RANDOM % 20)) + 1000))"
    page="${pages[$((RANDOM % ${#pages[@]}))]}"
    
    curl -s -X POST "$BASE_URL/page-view" \
        -H "Content-Type: application/json" \
        -d "{
            \"user_id\": \"$user_id\",
            \"page\": \"$page\",
            \"timestamp\": \"$timestamp\"
        }" > /dev/null
done

# Generate diverse element clicks
echo "🖱️ Creating diverse element click events..."
elements=("buy_button" "add_to_cart" "search_button" "menu_icon" "logo" "footer_link" "contact_button" "help_button" "filter_price" "filter_brand" "sort_by_price" "sort_by_rating" "wishlist_add" "compare_button" "share_button" "review_button" "subscribe_newsletter" "chat_support")
click_pages=("/product/laptop-pro" "/product/phone-x" "/catalog" "/search" "/home" "/category/electronics" "/deals" "/cart")

for i in {1..45}; do
    timestamp=$(generate_random_timestamp)
    user_id="${users[$((RANDOM % 20))]}_$(($((RANDOM % 20)) + 1000))"
    element="${elements[$((RANDOM % ${#elements[@]}))]}"
    page="${click_pages[$((RANDOM % ${#click_pages[@]}))]}"
    
    curl -s -X POST "$BASE_URL/element-click" \
        -H "Content-Type: application/json" \
        -d "{
            \"user_id\": \"$user_id\",
            \"element_name\": \"$element\",
            \"page\": \"$page\",
            \"timestamp\": \"$timestamp\"
        }" > /dev/null
done

# Generate search events with realistic queries
echo "🔍 Creating diverse search events..."
search_queries=("laptop" "smartphone" "headphones" "tablet" "mouse" "keyboard" "monitor" "speaker" "camera" "watch" "gaming laptop" "wireless earbuds" "4k monitor" "mechanical keyboard" "webcam" "bluetooth speaker" "fitness tracker" "power bank" "usb cable" "phone case")

for i in {1..30}; do
    timestamp=$(generate_random_timestamp)
    user_id="${users[$((RANDOM % 20))]}_$(($((RANDOM % 20)) + 1000))"
    query="${search_queries[$((RANDOM % ${#search_queries[@]}))]}"
    
    curl -s -X POST "$BASE_URL/search" \
        -H "Content-Type: application/json" \
        -d "{
            \"user_id\": \"$user_id\",
            \"query\": \"$query\",
            \"timestamp\": \"$timestamp\"
        }" > /dev/null
done

# Generate cart actions
echo "🛒 Creating cart interaction events..."
products=("laptop_pro_001" "phone_x_002" "tablet_air_003" "headphones_premium_004" "mouse_gaming_005" "keyboard_mechanical_006" "monitor_4k_007" "speaker_bluetooth_008" "camera_dslr_009" "watch_smart_010")

for i in {1..35}; do
    timestamp=$(generate_random_timestamp)
    user_id="${users[$((RANDOM % 20))]}_$(($((RANDOM % 20)) + 1000))"
    product="${products[$((RANDOM % ${#products[@]}))]}"
    
    # Add to cart
    curl -s -X POST "$BASE_URL/item-added-to-cart" \
        -H "Content-Type: application/json" \
        -d "{
            \"user_id\": \"$user_id\",
            \"item_id\": \"$product\",
            \"timestamp\": \"$timestamp\"
        }" > /dev/null
    
    # Sometimes remove from cart (20% chance)
    if [ $((RANDOM % 5)) -eq 0 ]; then
        sleep 1
        remove_timestamp=$(generate_random_timestamp)
        curl -s -X POST "$BASE_URL/item-removed-from-cart" \
            -H "Content-Type: application/json" \
            -d "{
                \"user_id\": \"$user_id\",
                \"item_id\": \"$product\",
                \"timestamp\": \"$remove_timestamp\"
            }" > /dev/null
    fi
done

# Generate form submissions
echo "📝 Creating form submission events..."
forms=("contact_form" "feedback_form" "newsletter_form" "support_form" "review_form" "survey_form" "return_request" "partnership_inquiry")

for i in {1..20}; do
    timestamp=$(generate_random_timestamp)
    user_id="${users[$((RANDOM % 20))]}_$(($((RANDOM % 20)) + 1000))"
    form="${forms[$((RANDOM % ${#forms[@]}))]}"
    
    curl -s -X POST "$BASE_URL/form-submit" \
        -H "Content-Type: application/json" \
        -d "{
            \"user_id\": \"$user_id\",
            \"form_name\": \"$form\",
            \"timestamp\": \"$timestamp\"
        }" > /dev/null
done

# Generate filter applications
echo "🔧 Creating filter application events..."
filters=("price_range" "brand" "rating" "category" "color" "size" "availability" "discount" "shipping" "warranty")
filter_values=("100-500" "501-1000" "1001-2000" "apple" "samsung" "sony" "4-5_stars" "3-4_stars" "electronics" "clothing" "books" "red" "blue" "black" "small" "medium" "large" "in_stock" "on_sale" "free_shipping")
filter_pages=("/catalog" "/search" "/category/electronics" "/category/clothing" "/deals")

for i in {1..25}; do
    timestamp=$(generate_random_timestamp)
    user_id="${users[$((RANDOM % 20))]}_$(($((RANDOM % 20)) + 1000))"
    filter="${filters[$((RANDOM % ${#filters[@]}))]}"
    value="${filter_values[$((RANDOM % ${#filter_values[@]}))]}"
    page="${filter_pages[$((RANDOM % ${#filter_pages[@]}))]}"
    
    curl -s -X POST "$BASE_URL/filter-applied" \
        -H "Content-Type: application/json" \
        -d "{
            \"user_id\": \"$user_id\",
            \"filter_name\": \"$filter\",
            \"filter_value\": \"$value\",
            \"page\": \"$page\",
            \"timestamp\": \"$timestamp\"
        }" > /dev/null
done

echo "✅ Realistic event generation completed!"
echo "📊 Generated diverse events across:"
echo "   - 20 user registrations"
echo "   - 40 user logins"
echo "   - 25 transactions"
echo "   - 60 page views"
echo "   - 45 element clicks"
echo "   - 30 searches"
echo "   - 35+ cart actions"
echo "   - 20 form submissions"
echo "   - 25 filter applications"
echo "   📅 Spread across the last 7 days with realistic hourly distribution"