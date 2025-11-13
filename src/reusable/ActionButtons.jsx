import React from 'react';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';

/**
 * Tombol Aksi (Ikon) yang reusable dengan Tooltip
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon - Komponen ikon (misal: <PencilFill />)
 * @param {string} props.tooltip - Teks yang muncul saat hover
 * @param {function} props.onClick - Fungsi saat diklik
 * @param {'secondary' | 'danger' | 'primary' | 'success'} [props.color='secondary'] - Warna ikon
 * @param {string} [props.className] - Class tambahan jika perlu
 */
const ActionButton = ({ icon, tooltip, onClick, color = 'secondary', className = '', ...props }) => {

  // Fungsi untuk merender Tooltip
  const renderTooltip = (tooltipProps) => (
    <Tooltip id={`tooltip-${tooltip.replace(/\s/g, '-')}`} {...tooltipProps}>
      {tooltip}
    </Tooltip>
  );

  // Mapping prop 'color' ke class text Bootstrap
  const colorClasses = {
    secondary: 'text-secondary',
    danger: 'text-danger',
    primary: 'text-primary',
    success: 'text-success',
  };

  const colorClass = colorClasses[color] || colorClasses.secondary;

  return (
    // OverlayTrigger dipakai untuk menampilkan tooltip saat hover
    <OverlayTrigger
      placement="top"
      delay={{ show: 300, hide: 200 }} // Jeda agar tidak langsung muncul
      overlay={renderTooltip}
    >
      <Button
        variant="link"
        onClick={onClick}
        // p-1: Memberi area klik yang lebih baik daripada p-0
        // lh-1: (line-height) Mencegah tombol jadi terlalu tinggi
        className={`p-1 lh-1 ${colorClass} ${className}`}
        {...props}
      >
        {icon}
      </Button>
    </OverlayTrigger>
  );
};

export default ActionButton;