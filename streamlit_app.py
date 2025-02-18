import streamlit as st
from websocket import create_connection
import json
from PIL import Image
import io
import base64
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set the page layout to wide
st.set_page_config(layout="wide")

st.title("Live Text Graph Generator")

st.write(
    """
    Enter any text in the left box.
    As you type, the graph on the right will update live, displaying a graph of entities and relationships
    extracted.
    """
)

# WebSocket URL - updated to use localhost
WS_URL = "ws://127.0.0.1:8000/ws"

# Create two full-width columns
col1, col2 = st.columns(2)

# Initialize session state
if 'ws_client' not in st.session_state:
    st.session_state.ws_client = None

def create_websocket():
    """Create a new WebSocket connection."""
    try:
        # Create WebSocket connection using create_connection
        ws = create_connection(WS_URL)
        logger.info("WebSocket connection established")
        return ws
    except Exception as e:
        logger.error(f"WebSocket connection error: {str(e)}")
        st.error(f"Failed to connect to WebSocket server: {str(e)}")
        return None

def send_text(text: str):
    """Send text through WebSocket and receive response."""
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            # Create new WebSocket connection if needed
            if st.session_state.ws_client is None:
                st.session_state.ws_client = create_websocket()
            
            if st.session_state.ws_client is None:
                raise Exception("Failed to establish WebSocket connection")

            # Send the text
            st.session_state.ws_client.send(json.dumps({"text": text}))
            
            # Receive the response
            response = st.session_state.ws_client.recv()
            return json.loads(response)

        except Exception as e:
            logger.error(f"WebSocket communication error (attempt {retry_count + 1}): {str(e)}")
            # Close the connection on error
            try:
                if st.session_state.ws_client:
                    st.session_state.ws_client.close()
            except:
                pass
            st.session_state.ws_client = None
            
            retry_count += 1
            if retry_count == max_retries:
                st.error(f"Failed to communicate with server after {max_retries} attempts")
                return None

def process_response(data):
    """Process and display the response data."""
    try:
        if "error" in data:
            st.error(f"Server error: {data['error']}")
            return

        if not data["entities"] and not data["edges"]:
            st.warning("No entities or edges were extracted from the text.")
            return

        st.subheader("Graph Info")
        st.write(f"Graph has {data['entity_count']} entities and {data['edge_count']} edges.")

        # Display the graph image
        image_bytes = base64.b64decode(data['graph_image'])
        image = Image.open(io.BytesIO(image_bytes))
        st.image(image, use_column_width=True)

    except Exception as e:
        logger.error(f"Error processing response: {str(e)}")
        st.error(f"Error processing server response: {str(e)}")

# Add text input and handle submissions
with col1:
    text_input = st.text_area("Enter any text", height=300, key="text_input")

with col2:
    if text_input.strip():
        with st.spinner("Extracting entities and relationships..."):
            response = send_text(text_input)
            if response:
                process_response(response)
    else:
        st.write("Enter text on the left to see the live graph.")

# Cleanup WebSocket connection when the script reruns
if st.session_state.ws_client:
    try:
        st.session_state.ws_client.close()
    except:
        pass

