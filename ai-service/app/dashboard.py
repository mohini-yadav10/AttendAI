"""
Multimodal Attendance & Engagement Agent
Milestone 6: Interface, Testing, and Deployment
Activity 6.2: Launch optional Streamlit dashboard (dashboard.py)

Provides an interactive web dashboard for instructors and administrators to:
- Monitor live / simulated multimodal session telemetry
- View real-time attendance markings based on sustained presence
- Inspect multimodal engagement scoring trends (Vision + Audio fusion)
- Review AI-driven teaching suggestions and pedagogical interventions
- Download timestamped CSV attendance logs and JSON analytical reports
"""

import os
import sys
from pathlib import Path
from datetime import datetime

# Set utf-8 stdout
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure app modules can be imported
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

try:
    import streamlit as st
    import pandas as pd
    import numpy as np
except ImportError as e:
    print(f"Error importing requirements: {e}. Please run `pip install streamlit pandas numpy`")
    sys.exit(1)

from app.main_runner import AttendAICoreRunner

# Page Configuration
st.set_page_config(
    page_title="AttendAI — Multimodal Classroom Intelligence",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling (Onyx & Warm Amber Gold)
st.markdown("""
<style>
    .main-title {
        font-size: 2.2rem;
        font-weight: 800;
        color: #f4f4f5;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        color: #a1a1aa;
        font-size: 1.05rem;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background: #18181b;
        border: 1px solid #27272a;
        border-radius: 12px;
        padding: 1.2rem;
        text-align: center;
    }
    .metric-val {
        font-size: 1.8rem;
        font-weight: 700;
        color: #f59e0b;
    }
    .metric-lbl {
        color: #71717a;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .suggestion-box {
        background: #18181b;
        border-left: 4px solid #f59e0b;
        border-radius: 6px;
        padding: 1rem;
        margin-bottom: 0.75rem;
    }
    .badge-present {
        background-color: #064e3b;
        color: #34d399;
        padding: 2px 8px;
        border-radius: 6px;
        font-weight: 600;
    }
    .badge-pending {
        background-color: #78350f;
        color: #fbbf24;
        padding: 2px 8px;
        border-radius: 6px;
        font-weight: 600;
    }
    .badge-absent {
        background-color: #7f1d1d;
        color: #f87171;
        padding: 2px 8px;
        border-radius: 6px;
        font-weight: 600;
    }
</style>
""", unsafe_allow_html=True)

# ── Sidebar Controls ─────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### ⚙️ Session Controls")
    st.caption("Multimodal Attendance & Engagement Agent (Milestone 6)")
    
    session_duration = st.slider("Session Duration (seconds)", min_value=10, max_value=60, value=20, step=5)
    num_students = st.slider("Number of Students", min_value=3, max_value=5, value=5, step=1)
    
    st.divider()
    st.markdown("### 🔒 Privacy & Architecture")
    st.info(
        "**Offline-First & Local:**\n"
        "• Vision: Haar Cascade / IoU Tracker\n"
        "• Audio: WebRTC VAD / Energy Filter\n"
        "• Signal Fusion: Rule-based heuristic\n"
        "• Zero biometric cloud leakage"
    )
    
    st.divider()
    run_button = st.button("▶️ Run Session Simulation", type="primary", use_container_width=True)

# ── Main Header ─────────────────────────────────────────────────────────────
st.markdown('<div class="main-title">🎓 AttendAI — Multimodal Intelligence Dashboard</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="sub-title">Milestone 6: Interface, Testing & Deployment — Real-time attendance, engagement signal fusion & AI teaching suggestions.</div>',
    unsafe_allow_html=True
)

if "session_result" not in st.session_state:
    st.session_state.session_result = None

if run_button or st.session_state.session_result is None:
    with st.spinner(f"Running multimodal session pipeline ({session_duration}s)..."):
        runner = AttendAICoreRunner(
            video_source=0,
            audio_source="mock",
            output_dir="reports",
            mock_mode=True
        )
        res = runner.run_simulation_session(duration_seconds=session_duration, num_students=num_students)
        st.session_state.session_result = res

res = st.session_state.session_result
summary = res["summary"]
students = summary["student_analytics"]
suggestions = summary["teaching_suggestions"]
audio_stats = summary["audio_stats"]

# ── KPI Cards Row ───────────────────────────────────────────────────────────
kpi1, kpi2, kpi3, kpi4 = st.columns(4)

total_students = len(students)
present_count = sum(1 for s in students if s["attendance_status"] == "present")
attendance_rate = (present_count / total_students) * 100 if total_students else 0.0
avg_score = summary["class_average_engagement"] * 100
speech_pct = audio_stats["overall_speech_ratio"] * 100

with kpi1:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-lbl">Attendance Rate</div>
        <div class="metric-val">{attendance_rate:.0f}%</div>
        <small style="color: #a1a1aa">{present_count} / {total_students} verified</small>
    </div>
    """, unsafe_allow_html=True)

with kpi2:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-lbl">Class Avg Engagement</div>
        <div class="metric-val">{avg_score:.1f}%</div>
        <small style="color: #a1a1aa">Multimodal fused index</small>
    </div>
    """, unsafe_allow_html=True)

with kpi3:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-lbl">Speech Activity</div>
        <div class="metric-val">{speech_pct:.0f}%</div>
        <small style="color: #a1a1aa">{audio_stats['speech_frames']} / {audio_stats['total_frames']} frames</small>
    </div>
    """, unsafe_allow_html=True)

with kpi4:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-lbl">Ambient Noise Profile</div>
        <div class="metric-val">{audio_stats['noise_profile'].upper()}</div>
        <small style="color: #a1a1aa">Peak RMS: {audio_stats['peak_energy']:.3f}</small>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# ── Main Content Split (Left: Attendance & Engagement, Right: AI Suggestions) ──
left_col, right_col = st.columns([1.6, 1.4])

with left_col:
    st.markdown("### 📋 Timestamped Attendance & Student Engagement")
    
    # Create DataFrame for display
    df_data = []
    for s in students:
        df_data.append({
            "ID": s["student_id"],
            "Student Name": s["name"],
            "Status": s["attendance_status"].upper(),
            "Avg Engagement": f"{s['avg_engagement_score']:.1%}",
            "Engagement Label": s["engagement_label"],
            "Trend": s["engagement_trend"].capitalize(),
            "Drops (<30%)": s["attention_drop_count"],
        })
    df = pd.DataFrame(df_data)
    st.dataframe(df, use_container_width=True, hide_index=True)

    st.markdown("#### 📈 Student Engagement Comparison")
    chart_df = pd.DataFrame({
        "Student": [s["name"] for s in students],
        "Engagement Score (%)": [s["avg_engagement_score"] * 100 for s in students]
    }).set_index("Student")
    st.bar_chart(chart_df, color="#f59e0b")

with right_col:
    st.markdown("### 💡 AI-Driven Teaching Suggestions")
    st.caption("Actionable, non-enforcing pedagogical interventions based on classroom multimodal signals:")
    
    if not suggestions:
        st.success("🌟 Class dynamics are healthy and engaged. No intervention required at this time.")
    else:
        for s in suggestions:
            prio = s["priority"].upper()
            badge_color = "#dc2626" if prio == "HIGH" else ("#f59e0b" if prio == "MEDIUM" else "#10b981")
            st.markdown(f"""
            <div class="suggestion-box">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <span style="font-size: 0.8rem; font-weight: 700; background: {badge_color}; color: #ffffff; padding: 2px 8px; border-radius: 4px;">
                        {prio} PRIORITY
                    </span>
                    <span style="color: #71717a; font-size: 0.8rem;">{s.get('type', 'general')}</span>
                </div>
                <div style="font-size: 0.95rem; color: #e4e4e7; line-height: 1.4;">
                    {s['suggestion']}
                </div>
                <div style="font-size: 0.8rem; color: #a1a1aa; margin-top: 0.4rem;">
                    <strong>Trigger:</strong> {s.get('trigger', 'Multimodal pattern')}
                </div>
            </div>
            """, unsafe_allow_html=True)

    st.markdown("#### 📥 Export Session Reports")
    dl1, dl2 = st.columns(2)
    with dl1:
        if os.path.exists(res["csv_path"]):
            with open(res["csv_path"], "rb") as f:
                st.download_button(
                    label="📄 Download Attendance CSV",
                    data=f.read(),
                    file_name=f"{res['session_id']}_attendance.csv",
                    mime="text/csv",
                    use_container_width=True
                )
    with dl2:
        if os.path.exists(res["json_path"]):
            with open(res["json_path"], "rb") as f:
                st.download_button(
                    label="📊 Download Analytics JSON",
                    data=f.read(),
                    file_name=f"{res['session_id']}_summary.json",
                    mime="application/json",
                    use_container_width=True
                )

# ── Footer ──────────────────────────────────────────────────────────────────
st.divider()
st.markdown(
    "<center><small style='color: #71717a'>"
    "AttendAI — Multimodal Attendance & Engagement Agent | Assigned to: Mohini Yadav | Category: Education (Individual)<br>"
    "GitHub: <a href='https://github.com/mohini-yadav10/AttendAI' target='_blank' style='color: #f59e0b'>github.com/mohini-yadav10/AttendAI</a>"
    "</small></center>",
    unsafe_allow_html=True
)
