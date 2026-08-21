using System;
using System.Windows.Forms;
using System.Drawing;

namespace RTSPViewer
{
    public class MouseHelper
    {
        private enum EdgeType { None = 0, LeftTop, Top, RightTop, Right, RightBottom, Bottom, LeftBottom, Left };
        private enum MouseMode { None = 0, Resize, Move };

        #region Form 이동
        private bool m_bLeftMouseDown = false;
        private Point m_ptMove = new Point();
        #endregion

        #region Resize
        private Size m_sizeOrigin = new Size();
        private Point m_ptOrigin = new Point();

        private int m_nEdgeThick = 10;
        #endregion

        // 작아질 수 있는 최소 크기
        private Size m_sizeMinimum = new Size(278, 278);

        private FormMain m_frm = null;
        private EdgeType m_edgeType = EdgeType.None;
        private MouseMode m_mouseMode = MouseMode.None;

        public MouseHelper(FormMain frm)
        {
            m_frm = frm;
        }

        public void OnMouseDown(MouseEventArgs e, Point ptMouse)
        {
            if (e.Button == System.Windows.Forms.MouseButtons.Left)
            {
                m_bLeftMouseDown = true;
                m_ptMove = ptMouse;
                m_sizeOrigin = m_frm.Size;
                m_ptOrigin = m_frm.Location;

                if (m_edgeType != EdgeType.None)
                    m_mouseMode = MouseMode.Resize;
                else
                    m_mouseMode = MouseMode.Move;
            }
        }

        public void OnMouseUp(MouseEventArgs e)
        {
            if (e.Button == System.Windows.Forms.MouseButtons.Left)
            {
                m_bLeftMouseDown = false;
                m_frm.ChangeSize(m_frm.Size.Width, m_frm.Size.Height);
                m_mouseMode = MouseMode.None;
            }
        }

        public void OnMouseMove(object sender, MouseEventArgs e, Point ptMouse)
        {
            if (m_mouseMode != MouseMode.Move && !m_bLeftMouseDown)
                OnMouseEnter(ptMouse);

            if (!m_bLeftMouseDown)
                return;

            if (m_edgeType == EdgeType.None && m_mouseMode == MouseMode.Move)
                Move(ptMouse);
            else if (m_mouseMode == MouseMode.Resize)
            {
                Point ptScreen = ptMouse;

                int dx = ptScreen.X - m_ptMove.X;
                int dy = ptScreen.Y - m_ptMove.Y;

                if (dx != 0 || dy != 0)
                    Resize(dx, dy);
            }
        }

        private void Resize(int dx, int dy)
        {
            if (m_edgeType == EdgeType.Left)
            {
                m_frm.Location = new Point(m_ptOrigin.X + dx, m_ptOrigin.Y);
                ChangeSize(m_sizeOrigin.Width - dx, m_sizeOrigin.Height);
            }
            else if (m_edgeType == EdgeType.Right)
            {
                ChangeSize(m_sizeOrigin.Width + dx, m_sizeOrigin.Height);
            }
            else if (m_edgeType == EdgeType.Top)
            {
                m_frm.Location = new Point(m_ptOrigin.X, m_ptOrigin.Y + dy);
                ChangeSize(this.m_sizeOrigin.Width, this.m_sizeOrigin.Height - dy);
            }
            else if (m_edgeType == EdgeType.Bottom)
            {
                ChangeSize(this.m_sizeOrigin.Width, this.m_sizeOrigin.Height + dy);
            }
            else if (m_edgeType == EdgeType.LeftTop)
            {
                m_frm.Location = new Point(m_ptOrigin.X + dx, m_ptOrigin.Y + dy);
                ChangeSize(this.m_sizeOrigin.Width - dx, this.m_sizeOrigin.Height - dy);
            }
            else if (m_edgeType == EdgeType.LeftBottom)
            {
                m_frm.Location = new Point(m_ptOrigin.X + dx, m_ptOrigin.Y);
                ChangeSize(this.m_sizeOrigin.Width - dx, this.m_sizeOrigin.Height + dy);
            }
            else if (m_edgeType == EdgeType.RightBottom)
            {
                ChangeSize(this.m_sizeOrigin.Width + dx, this.m_sizeOrigin.Height + dy);
            }
            else if (m_edgeType == EdgeType.RightTop)
            {
                m_frm.Location = new Point(m_ptOrigin.X, m_ptOrigin.Y + dy);
                ChangeSize(this.m_sizeOrigin.Width + dx, this.m_sizeOrigin.Height - dy);
            }
        }

        private void ChangeSize(int width, int height)
        {
            if (width < m_sizeMinimum.Width)
                width = m_sizeMinimum.Width;

            if (height < m_sizeMinimum.Height)
                height = m_sizeMinimum.Height;

            m_frm.ChangeSize(width, height);
        }

        private void Move(Point ptMouse)
        {
            Point ptScreen = ptMouse;

            int dx = ptScreen.X - m_ptMove.X;
            int dy = ptScreen.Y - m_ptMove.Y;

            if (dx == 0 && dy == 0)
                return;

            Point ptCur = m_frm.Location;
            m_frm.Location = new Point(ptCur.X + dx, ptCur.Y + dy);
            m_ptMove.X += dx;
            m_ptMove.Y += dy;
        }

        public void OnMouseEnter(Point ptMouse)
        {
            int x = ptMouse.X - m_frm.Location.X;
            int y = ptMouse.Y - m_frm.Location.Y;

            EdgeType edgeType = GetEdgeType(x, y);
            SetMouseCursor(edgeType);
        }

        public void OnMouseLeave()
        {
            SetMouseCursor(EdgeType.None);
        }

        private void SetMouseCursor(EdgeType edgeType)
        {
            if (edgeType == EdgeType.Left || edgeType == EdgeType.Right)
                m_frm.Cursor = Cursors.SizeWE;
            else if (edgeType == EdgeType.Bottom || edgeType == EdgeType.Top)
                m_frm.Cursor = Cursors.SizeNS;
            else if (edgeType == EdgeType.LeftBottom || edgeType == EdgeType.RightTop)
                m_frm.Cursor = Cursors.SizeNESW;
            else if (edgeType == EdgeType.LeftTop || edgeType == EdgeType.RightBottom)
                m_frm.Cursor = Cursors.SizeNWSE;
            else
                m_frm.Cursor = Cursors.Arrow;

            m_edgeType = edgeType;
        }

        private EdgeType GetEdgeType(int x, int y)
        {
            int width = m_frm.Size.Width;
            int height = m_frm.Size.Height;

            if (x <= m_nEdgeThick)
            {
                if (y <= m_nEdgeThick)
                    return EdgeType.LeftTop;
                else if (y >= height - m_nEdgeThick)
                    return EdgeType.LeftBottom;
                else
                    return EdgeType.Left;
            }
            else if (x >= width - m_nEdgeThick)
            {
                if (y <= m_nEdgeThick)
                    return EdgeType.RightTop;
                else if (y >= height - m_nEdgeThick)
                    return EdgeType.RightBottom;
                else
                    return EdgeType.Right;
            }
            else if (y <= m_nEdgeThick)
            {
                if (x <= m_nEdgeThick)
                    return EdgeType.LeftTop;
                else if (x >= width - m_nEdgeThick)
                    return EdgeType.RightTop;
                else
                    return EdgeType.Top;
            }
            else if (y >= height - m_nEdgeThick)
            {
                if (x <= m_nEdgeThick)
                    return EdgeType.LeftBottom;
                else if (x >= width - m_nEdgeThick)
                    return EdgeType.RightBottom;
                else
                    return EdgeType.Bottom;
            }

            return EdgeType.None;
        }
    }
}
