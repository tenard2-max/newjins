#!/bin/bash
# 웹소설 네비게이터 실행 스크립트

export PATH=$PATH:/home/ubuntu/.local/bin

cd "$(dirname "$0")"

# 패키지 확인 및 설치
python3 -c "import streamlit" 2>/dev/null || pip3 install streamlit pyvis networkx pandas -q

# 앱 실행
streamlit run app.py --server.port "${PORT:-8501}" --server.address "0.0.0.0"
